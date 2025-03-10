using System.Text;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace UnitedForUkraine.Server.Services;

public class AuthTokenService : IAuthTokenService
{
    private readonly IConfiguration _config;
    private readonly IConfigurationSection _jwtSettings;
    private readonly SymmetricSecurityKey _key;

    public AuthTokenService(IConfiguration config)
    {
        _config = config;
        _jwtSettings = _config.GetSection("JwtSettings");
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings["SecretKey"]!));
    }

    public string CreateToken(AppUser user)
    {
        List<Claim> claims = new()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!),
            };

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds,
            Issuer = _jwtSettings["Issuer"]!,
            Audience = _jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

}