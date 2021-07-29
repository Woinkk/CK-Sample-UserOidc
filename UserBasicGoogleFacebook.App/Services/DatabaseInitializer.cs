using CK.Core;
using CK.DB.Actor;
using CK.DB.Auth;
using CK.DB.User.UserPassword;
using CK.SqlServer;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace UserBasicGoogleFacebook.App
{
    public class DatabaseInitializer : IHostedService, ISingletonAutoService
    {

        private readonly UserTable _userTable;
        private readonly UserPasswordTable _userPasswordTable;

        public DatabaseInitializer
        (
            UserTable userTable,
            UserPasswordTable userPasswordTable
        )
        {
            _userTable = userTable;
            _userPasswordTable = userPasswordTable;
        }
        public async Task StartAsync( CancellationToken cancellationToken )
        {
            using( var ctx = new SqlStandardCallContext() )
            {
                // Create the user if the user already exist userId is equal to -1.
                int userId = await _userTable.CreateUserAsync( ctx, 1, "Spencer" );

                // Set the password of the first user if the user has just been created.
                if( userId != -1 )
                {
                    _userPasswordTable.CreateOrUpdatePasswordUser( ctx, userId, userId, "password", UCLMode.CreateOnly );
                }

                // Generate Guid then try to create the password for the user "System".
                string systemPassword = Guid.NewGuid().ToString();
                UCLResult creationResult = _userPasswordTable.CreateOrUpdatePasswordUser( ctx, 1, 1, systemPassword, UCLMode.CreateOnly );

                // If the operation result is "Created" then we write the Guid in a txt file at the root of the WebHost folder.
                if( creationResult.OperationResult == UCResult.Created )
                {
                    string destPath = Path.Combine( Environment.CurrentDirectory, "SystemPassword.txt" );
                    File.WriteAllText( destPath, systemPassword.ToString() );
                }
            }
        }

        public Task StopAsync( CancellationToken cancellationToken )
        {
            return Task.CompletedTask;
        }
    }
}
