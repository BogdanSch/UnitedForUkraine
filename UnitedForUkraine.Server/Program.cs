using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Extensions;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Repositories;
using UnitedForUkraine.Server.Services;
using Stripe;

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
builder.Services.AddFluentEmail(builder.Configuration);
builder.Services.AddHttpClient<ICurrencyConverterService, CurrencyConverterService>();

builder.Services.AddScoped<IDonationRepository, DonationRepository>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IAuthTokenService, AuthTokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSettings"));
builder.Services.Configure<FrontendSettings>(builder.Configuration.GetSection("FrontendSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

StripeConfiguration.ApiKey = builder.Configuration.GetSection("StripeSettings")["SecretKey"];

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

builder.Services.AddAuthentication(builder.Configuration);
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
