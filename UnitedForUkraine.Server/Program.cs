using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Stripe;
using System.Text;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Repositories;
using UnitedForUkraine.Server.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddHttpClient<ICurrencyConverterService, CurrencyConverterService>();

builder.Services.AddScoped<IDonationRepository, DonationRepository>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IAuthTokenService, AuthTokenService>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSettings"));
builder.Services.Configure<FrontendSettings>(builder.Configuration.GetSection("FrontendSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

StripeConfiguration.ApiKey = builder.Configuration.GetSection("StripeSettings")["SecretKey"];

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

IConfigurationSection jwtSettings = builder.Configuration.GetSection("JwtSettings");
byte[] key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

builder.Services.AddAuthentication(options =>
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

builder.Services.AddAuthorization();
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

if (args.Length == 1 && args[0] == "seeddata")
{
    Seed.SeedUsersAndRolesAsync(app).Wait();
    Seed.SeedCampaignsAndDonationsAsync(app).Wait();
}

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

IConfigurationSection frontendSettings = builder.Configuration.GetSection("FrontendSettings");
app.UseCors(cors => cors
                  .WithOrigins(frontendSettings["Origin"]!)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
