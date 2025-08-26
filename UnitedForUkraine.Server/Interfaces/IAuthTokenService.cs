using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IAuthTokenService
{
    (string, DateTime) GenerateToken(AppUser user, IList<string> roles);
    (string, DateTime) GenerateRefreshToken(bool rememberUser);
    TokenObject CreateToken(AppUser user, IList<string> roles, bool rememberUser);
    void SetTokensInsideCookie(TokenObject token, HttpContext context);
}
