using CK.Sample.User.UserOidc.App;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CK.Sample.User.UserOidc.WebHost
{
    public class Program
    {
        // Ceci utilise les "black-box" CreateDefaultBuilder et ConfigureWebHostDefaults.
        // CK-Sample-Monitoring ne fait pas ça...
        public static void Main(string[] args)
        {
            Host.CreateDefaultBuilder(args)
                 .UseCKMonitoring()
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
