using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IAuthTokenService
{
    (string, DateTime) GenerateToken(AppUser user, IList<string> roles);
    (string, DateTime) GenerateRefreshToken(bool rememberUser);
}
