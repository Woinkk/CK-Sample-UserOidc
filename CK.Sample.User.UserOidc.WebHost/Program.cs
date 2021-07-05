using CK.Sample.User.UserOidc.App;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CK.Sample.User.UserOidc.WebHost
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Host.CreateDefaultBuilder(args)
                 .UseMonitoring()
                 .ConfigureWebHostDefaults(webBuilder =>
                 {
                     webBuilder
                         .UseKestrel()
                         .UseScopedHttpContext()
                         .UseIISIntegration()
                         .UseStartup<Startup>();
                 })
                .Build()
                .Run();
        }
    }
}
