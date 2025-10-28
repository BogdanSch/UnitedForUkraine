using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Data;

public class Seed
{
    public const string DEFAULT_IMAGE_URL = "https://placehold.co/600x400/EEE/31343C";
    public static async Task SeedCampaignsAndDonationsAsync(IApplicationBuilder applicationBuilder)
    {
        using var serviceScope = applicationBuilder.ApplicationServices.CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();


        if (!context.Campaigns.Any())
        {
            List<Campaign> newCampaigns =
            [
                new()
                {
                    Title = "Medical Aid for Ukraine",
                    Slogan = "Support urgent medical needs",
                    Description = "Providing medical supplies and assistance to those in need.",
                    GoalAmount = 100000m,
                    RaisedAmount = 25000m,
                    Currency = CurrencyType.USD,
                    StartDate = DateTime.UtcNow.AddDays(-10),
                    EndDate = DateTime.UtcNow.AddMonths(2),
                    ImageUrl = DEFAULT_IMAGE_URL,
                    Status = CampaignStatus.Ongoing,
                },
                new()
                {
                    Title = "Rebuild Schools Initiative",
                    Slogan = "Education for a brighter future",
                    Description = "Helping rebuild educational facilities in war-affected areas.",
                    GoalAmount = 50000m,
                    RaisedAmount = 12000m,
                    Currency = CurrencyType.UAH,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(4),
                    ImageUrl = DEFAULT_IMAGE_URL,
                    Status = CampaignStatus.Upcoming,
                }
            ];

            await context.Campaigns.AddRangeAsync(newCampaigns);
            await context.SaveChangesAsync();
        }

        AppUser? firstUser = await context.Users.FirstOrDefaultAsync();

        List<Campaign> campaigns = await context.Campaigns.AsNoTracking().ToListAsync();
        if (!context.Donations.Any())
        {
            if (firstUser is not null && campaigns.Count != 0)
            {
                List<Donation> donations = [
                        new()
                        {
                            UserId = firstUser.Id,
                            CampaignId = campaigns.First().Id,
                            Amount = 100m,
                            Currency = CurrencyType.USD,
                            PaymentDate = DateTime.UtcNow.AddDays(-5),
                            PaymentMethod = PaymentMethod.CreditCard,
                            Status = DonationStatus.Completed
                        },
                        new()
                        {
                            UserId = firstUser.Id,
                            CampaignId = campaigns.Last().Id,
                            Amount = 50m,
                            Currency = CurrencyType.EUR,
                            PaymentDate = DateTime.UtcNow.AddDays(-2),
                            PaymentMethod = PaymentMethod.PayPal,
                            Status = DonationStatus.Pending
                        }
                    ];

                await context.Donations.AddRangeAsync(donations);
                await context.SaveChangesAsync();
            }
        }
        if(!context.NewsUpdates.Any())
        {
            if (firstUser is not null && campaigns.Count != 0)
            {
                List<NewsUpdate> newsUpdates =
                [
                        new()
                        {
                            Title = "Ukraine Receives International Aid",
                            KeyWords = "Ukraine, International Aid, Support",
                            Content = "Several countries have pledged support to Ukraine in its time of need...",
                            ImageUrl = DEFAULT_IMAGE_URL,
                            ReadingTimeInMinutes = 5,
                            PostedAt = DateTime.UtcNow.AddDays(-1),
                            AuthorId = firstUser.Id, 
                            CampaignId = campaigns.First().Id,
                            ViewsCount = 0
                        },
                        new()
                        {
                            Title = "Rebuilding Efforts in War-Torn Areas",
                            KeyWords = "Rebuilding, Ukraine, Communities",
                            Content = "Communities are coming together to rebuild homes and infrastructure...",
                            ImageUrl = DEFAULT_IMAGE_URL,
                            ReadingTimeInMinutes = 4,
                            PostedAt = DateTime.UtcNow,
                            AuthorId = firstUser.Id,
                            CampaignId = campaigns.Last().Id,
                            ViewsCount = 0
                        }
                    ];

                await context.NewsUpdates.AddRangeAsync(newsUpdates);
                await context.SaveChangesAsync();
            }
        }
    }
    public static async Task SeedUsersAndRolesAsync(IApplicationBuilder applicationBuilder)
    {
        using var serviceScope = applicationBuilder.ApplicationServices.CreateScope();
        //Roles
        var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
            await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        if (!await roleManager.RoleExistsAsync(UserRoles.User))
            await roleManager.CreateAsync(new IdentityRole(UserRoles.User));

        //Users
        UserManager<AppUser> userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

        string adminUserEmail = "bogsvity777@gmail.com";
        AppUser? adminUser = await userManager.FindByEmailAsync(adminUserEmail);
        if (adminUser is null)
        {
            var newAdminUser = new AppUser()
            {
                UserName = "bogsvity777",
                Email = adminUserEmail,
                EmailConfirmed = true,
                PhoneNumber = "+380123456789",
                RegisteredAt = DateTime.UtcNow,
                Address = new Address()
            };
            await userManager.CreateAsync(newAdminUser, "Coding@1234?");
            await userManager.AddToRoleAsync(newAdminUser, UserRoles.Admin);
        }

        string appUserEmail = "user@etickets.com";
        var appUser = await userManager.FindByEmailAsync(appUserEmail);
        if (appUser is null)
        {
            var newAppUser = new AppUser()
            {
                UserName = "app-user",
                Email = appUserEmail,
                EmailConfirmed = true,
                PhoneNumber = "+380123456789",
                RegisteredAt = DateTime.UtcNow,
                Address = new Address()
            };
            await userManager.CreateAsync(newAppUser, "Coding@1234?");
            await userManager.AddToRoleAsync(newAppUser, UserRoles.User);
        }
    }
}
