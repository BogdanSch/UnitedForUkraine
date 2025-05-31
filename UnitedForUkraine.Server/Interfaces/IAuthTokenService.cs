using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IAuthTokenService
{
    public string CreateToken(AppUser user, IList<string> roles, bool rememberUser);
}
