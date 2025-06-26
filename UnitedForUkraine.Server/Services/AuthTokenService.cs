using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Services;

public class AuthTokenService(IOptions<JwtSettings> jwtSettings) : IAuthTokenService
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;
    private readonly SymmetricSecurityKey _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Value.SecretKey));
    public const int DEFAULT_EXPIRY_MINUTES = 180;

    public string CreateToken(AppUser user, IList<string> roles, bool rememberUser)
    {
        List<Claim> claims =
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!),
            ];
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        SigningCredentials creds = new(_key, SecurityAlgorithms.HmacSha512Signature);

        DateTime currentTime = DateTime.Now;

        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = rememberUser ? currentTime.AddDays(_jwtSettings.ExpiryDays) : currentTime.AddMinutes(DEFAULT_EXPIRY_MINUTES),
            SigningCredentials = creds,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
        };

        JwtSecurityTokenHandler tokenHandler = new();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}