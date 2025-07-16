using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace UnitedForUkraine.Server.Extensions
{
    public static class AuthenticationExtensions
    {
        public static void AddAuthentication(this IServiceCollection services, ConfigurationManager configuration)
        {
            IConfigurationSection jwtSettings = configuration.GetSection("JwtSettings");
            byte[] key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

            string? googleClientId = configuration.GetSection("Authentication")["Google:ClientId"];
            string? googleClientSecret = configuration.GetSection("Authentication")["Google:ClientSecret"];

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                options.DefaultChallengeScheme =
                options.DefaultForbidScheme =
                options.DefaultScheme =
                options.DefaultSignInScheme =
                options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddGoogle(options =>
            {
                if(string.IsNullOrWhiteSpace(googleClientId)) throw new ArgumentNullException(nameof(googleClientId));
                else if (string.IsNullOrWhiteSpace(googleClientSecret)) throw new ArgumentNullException(nameof(googleClientSecret));
                options.ClientSecret = googleClientSecret;
                options.ClientId = googleClientId;
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                };
            });
        }
    }
}
