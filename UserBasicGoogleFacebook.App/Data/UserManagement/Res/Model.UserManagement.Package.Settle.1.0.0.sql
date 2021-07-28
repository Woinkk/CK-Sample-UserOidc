--[beginscript]

-- Create group "Signature Code"
declare @GroupId int;
declare @Password varbinary;
exec CK.sGroupCreate 1, @GroupId output;
exec CK.sGroupGroupNameSet 1, @GroupId, 'Signature Code';

-- Creating the 'Romain' administrator.
declare @AdminId int;
exec CK.sUserCreate 1,
                    N'Romain',
                    @AdminId output;

-- First password recovery will validate the email.
exec CK.sActorEMailAdd 1, @AdminId, 'romain.delorme-glorieux@signature-code.com', 1, 0;

exec CK.sGroupUserAdd 1, 2 /*=@@AdministratorGroupId*/, @AdminId, @AutoAddUserInZone = 1;

--[endscript]
