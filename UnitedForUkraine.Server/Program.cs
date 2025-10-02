using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Extensions;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Repositories;
using UnitedForUkraine.Server.Services;
using Scalar.AspNetCore;
using Stripe;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 7;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddFluentEmail(builder.Configuration);
builder.Services.AddHttpClient<ICurrencyConverterService, CurrencyConverterService>();

builder.Services.AddScoped<IDonationRepository, DonationRepository>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<INewsUpdateRepository, NewsUpdateRepository>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IAuthTokenService, AuthTokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddHostedService<CampaignBackgroundService>();

IConfigurationSection stripeSettings = builder.Configuration.GetSection(nameof(StripeSettings));
IConfigurationSection frontendSettings = builder.Configuration.GetSection(nameof(FrontendSettings));

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection(nameof(CloudinarySettings)));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(nameof(JwtSettings)));
builder.Services.Configure<StripeSettings>(stripeSettings);
builder.Services.Configure<FrontendSettings>(frontendSettings);

StripeConfiguration.ApiKey = stripeSettings["SecretKey"];

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

app.UseCors(cors => cors
                  .WithOrigins(frontendSettings["Origin"]!)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials());

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();