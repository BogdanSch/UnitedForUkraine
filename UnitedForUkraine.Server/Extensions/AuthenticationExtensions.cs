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

            string? facebookAppId = configuration.GetSection("Authentication")["Facebook:AppId"];
            string? facebookAppSecret = configuration.GetSection("Authentication")["Facebook:AppSecret"];

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
            .AddFacebook(options =>
            {
                if (string.IsNullOrWhiteSpace(facebookAppId)) throw new ArgumentNullException(nameof(facebookAppId));
                else if (string.IsNullOrWhiteSpace(facebookAppSecret)) throw new ArgumentNullException(nameof(facebookAppSecret));
                options.AppId = facebookAppId;
                options.AppSecret = facebookAppSecret;
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
