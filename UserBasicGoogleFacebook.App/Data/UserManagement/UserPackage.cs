using CK.Core;
using CK.DB.Actor.ActorEMail;

namespace UserBasicGoogleFacebook.App.Data.UserManagement
{
    [SqlPackage( FullName = "UserManagement.Package", ResourcePath = "Res", Schema = "CK", ResourceType = typeof( UserPackage ) )]
    [Versions( "1.0.0" )]
    public abstract class UserPackage : SqlPackage
    {
        CK.DB.Zone.GroupTable _groupTable;
        ActorEMailTable _eMailTable;

        void StObjConstruct(
            ActorEMailTable emailTable,
            CK.DB.Zone.GroupTable groupTable
        )
        {
            _groupTable = groupTable;
            _eMailTable = emailTable;
        }
    }
}
