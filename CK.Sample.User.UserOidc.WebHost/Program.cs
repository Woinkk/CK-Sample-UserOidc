using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CK.Sample.User.UserOidc.App;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CK.Sample.User.UserOidc.WebHost
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Using the default "black box"...
            // (See the Front.Web Program.cs for a detailed and explicit configuration.)
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
