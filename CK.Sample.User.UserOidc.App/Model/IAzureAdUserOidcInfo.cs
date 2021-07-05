using CK.DB.User.UserOidc;
using System.Collections.Generic;

namespace CK.Sample.User.UserOidc.App
{
    public interface IAzureAdUserOidcInfo : IUserOidcInfo
    {
        string Username { get; set; }
        string DisplayName { get; set; }
        string? Email { get; set; }
        IReadOnlyList<string>? Phones { get; set; }
    }
}
