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

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
               options.DefaultChallengeScheme =
               options.DefaultForbidScheme =
               options.DefaultScheme =
               options.DefaultSignInScheme =
               options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
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
