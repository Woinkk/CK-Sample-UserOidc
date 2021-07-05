using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using CK.AspNet.Auth;
using CK.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Graph;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace CK.Sample.User.UserOidc.App
{
    public class Startup
    {
        readonly IConfiguration _configuration;
        readonly IWebHostEnvironment _hostingEnvironment;
        readonly IActivityMonitor _startupMonitor;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _startupMonitor = new ActivityMonitor($"App {env.ApplicationName}/{env.EnvironmentName} on {Environment.MachineName}/{Environment.UserName}.");
            _configuration = configuration;
            _hostingEnvironment = env;
        }

        private void CheckSameSite(HttpContext httpContext, CookieOptions options)
        {
            if (options.SameSite == SameSiteMode.None)
            {
                var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
                // TODO: Use your User Agent library of choice here.
                if (!DisallowsSameSiteNone(userAgent))
                {
                    // For .NET Core < 3.1 set SameSite = (SameSiteMode)(-1)
                    options.SameSite = SameSiteMode.Unspecified;
                }
            }
        }

        public static bool DisallowsSameSiteNone(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent))
            {
                return false;
            }

            // Cover all iOS based browsers here. This includes:
            // - Safari on iOS 12 for iPhone, iPod Touch, iPad
            // - WkWebview on iOS 12 for iPhone, iPod Touch, iPad
            // - Chrome on iOS 12 for iPhone, iPod Touch, iPad
            // All of which are broken by SameSite=None, because they use the iOS networking stack
            if (userAgent.Contains("CPU iPhone OS 12") || userAgent.Contains("iPad; CPU OS 12"))
            {
                return true;
            }

            // Cover Mac OS X based browsers that use the Mac OS networking stack. This includes:
            // - Safari on Mac OS X.
            // This does not include:
            // - Chrome on Mac OS X
            // Because they do not use the Mac OS networking stack.
            if (userAgent.Contains("Macintosh; Intel Mac OS X 10_14") &&
                userAgent.Contains("Version/") && userAgent.Contains("Safari"))
            {
                return true;
            }

            // Cover Chrome 50-69, because some versions are broken by SameSite=None, 
            // and none in this range require it.
            // Note: this covers some pre-Chromium Edge versions, 
            // but pre-Chromium Edge does not require SameSite=None.
            if (userAgent.Contains("Chrome/5") || userAgent.Contains("Chrome/6"))
            {
                return true;
            }

            return false;
        }

        public void ConfigureServices(IServiceCollection services)
        {

            // The entry point assembly contains the generated code.
            services.AddCKDatabase(_startupMonitor, System.Reflection.Assembly.GetEntryAssembly());

            services.AddControllers();

            //Configured cookie policy due to correlation fail when trying to authenticate with oidc (review that)
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
                options.OnAppendCookie = cookieContext =>
                    CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
                options.OnDeleteCookie = cookieContext =>
                    CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
            });

            services
                .AddAuthentication(o => o.DefaultScheme = WebFrontAuthOptions.OnlyAuthenticationScheme)
                .AddOpenIdConnect("Oidc.Signature", o =>
                {
                    if (!_hostingEnvironment.IsProduction())
                    {
                        o.RequireHttpsMetadata = false;
                    }

                    //Setup the Oidc authentication options
                    string instance = _configuration["Authentication:Oidc.Signature:Instance"];
                    string tenantId = _configuration["Authentication:Oidc.Signature:TenantId"];
                    string clientId = _configuration["Authentication:Oidc.Signature:ClientId"];
                    string clientSecret = _configuration["Authentication:Oidc.Signature:ClientSecret"];
                    string callbackPath = _configuration["Authentication:Oidc.Signature:CallbackPath"];
                    string signedoutCallbackPath = _configuration["Authentication:Oidc.Signature:SignedOutCallbackPath"];

                    o.Authority = $"{instance.TrimEnd('/')}/{tenantId}/v2.0";
                    o.AuthenticationMethod = OpenIdConnectRedirectBehavior.RedirectGet;
                    o.ClientId = clientId;
                    o.ClientSecret = clientSecret;
                    o.ResponseMode = OpenIdConnectResponseMode.FormPost;
                    o.ResponseType = OpenIdConnectResponseType.CodeIdToken;
                    o.CallbackPath = new PathString(callbackPath);
                    o.SignedOutCallbackPath = new PathString(signedoutCallbackPath);
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = o.Authority,
                    };
                    o.SaveTokens = true;

                    //Set an event on ticket received
                    o.Events.OnTicketReceived = c => c.WebFrontAuthRemoteAuthenticateAsync<IAzureAdUserOidcInfo>(payload =>
                    {
                        payload.SchemeSuffix = "Signature";
                        payload.Sub = c.Principal.FindFirst(ClaimTypes.NameIdentifier).Value;
                        payload.DisplayName = c.Principal.FindFirst("name").Value;
                        payload.Username = c.Principal.FindFirst("preferred_username").Value;
                        payload.Email = c.Principal.FindFirst("verified_primary_email")?.Value;
                    });
                })
                .AddWebFrontAuth(options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                });

            services.AddCors();
        }

        public void Configure(IApplicationBuilder app)
        {
            if (_hostingEnvironment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseGuardRequestMonitor();

            app.UseCors(c =>
               c.SetIsOriginAllowed(host => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseCookiePolicy();
            app.UseAuthentication();
        }
    }
}
