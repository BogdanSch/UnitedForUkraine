using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Services;

public class AuthTokenService(IOptions<JwtSettings> jwtSettings) : IAuthTokenService
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;
    private readonly SymmetricSecurityKey _key = new (Encoding.UTF8.GetBytes(jwtSettings.Value.SecretKey));
    public const int DEFAULT_EXPIRATION_TIME_IN_MINUTES = 180;

    public (string, DateTime) GenerateToken(AppUser user, IList<string> roles)
    {
        List<Claim> claims =
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!),
            ];
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        //SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        SigningCredentials credentials = new(_key, SecurityAlgorithms.HmacSha512Signature);

        DateTime currentTime = DateTime.UtcNow;
        DateTime expirationTime = currentTime.AddMinutes(_jwtSettings.AccessTokenExpirationTimeInMinutes);

        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expirationTime,
            SigningCredentials = credentials,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
        };

        JwtSecurityTokenHandler tokenHandler = new();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

        return (tokenHandler.WriteToken(token), expirationTime);
    }
    public (string, DateTime) GenerateRefreshToken(bool rememberUser)
    {
        byte[] randomNumbers = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumbers);

        string token = Convert.ToBase64String(randomNumbers);
        DateTime expirationTime = DateTime.UtcNow;

        if (rememberUser)
        {
            expirationTime = expirationTime.AddDays(_jwtSettings.RefreshTokenExpirationTimeInDays);
        }
        else
        {
            expirationTime = expirationTime.AddMinutes(DEFAULT_EXPIRATION_TIME_IN_MINUTES);
        }

        return (token, expirationTime);
    }
}