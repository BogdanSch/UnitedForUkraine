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
            List<Campaign> campaigns = new List<Campaign>
                {
                    new()
                    {
                        Title = "Medical Aid for Ukraine",
                        Description = "Providing medical supplies and assistance to those in need.",
                        GoalAmount = 100000m,
                        RaisedAmount = 25000m,
                        Currency = CurrencyType.USD,
                        StartDate = DateTime.UtcNow.AddDays(-10),
                        EndDate = DateTime.UtcNow.AddMonths(2),
                        ImageUrl = DEFAULT_IMAGE_URL,
                        Status = CampaignStatus.Ongoing
                    },
                    new()
                    {
                        Title = "Rebuild Schools Initiative",
                        Description = "Helping rebuild educational facilities in war-affected areas.",
                        GoalAmount = 50000m,
                        RaisedAmount = 12000m,
                        Currency = CurrencyType.UAH,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddMonths(4),
                        ImageUrl = DEFAULT_IMAGE_URL,
                        Status = CampaignStatus.Upcoming
                    }
                };

            await context.Campaigns.AddRangeAsync(campaigns);
            await context.SaveChangesAsync();
        }
        if (!context.Donations.Any())
        {
            var users = context.Users.ToList();
            var campaigns = context.Campaigns.ToList();

            if (users.Any() && campaigns.Any())
            {
                var donations = new List<Donation>
                    {
                        new()
                        {
                            UserId = users.First().Id,
                            CampaignId = campaigns.First().Id,
                            Amount = 100m,
                            Currency = CurrencyType.USD,
                            PaymentDate = DateTime.UtcNow.AddDays(-5),
                            PaymentMethod = PaymentMethod.CreditCard,
                            Status = DonationStatus.Completed
                        },
                        new()
                        {
                            UserId = users.Last().Id,
                            CampaignId = campaigns.Last().Id,
                            Amount = 50m,
                            Currency = CurrencyType.EUR,
                            PaymentDate = DateTime.UtcNow.AddDays(-2),
                            PaymentMethod = PaymentMethod.PayPal,
                            Status = DonationStatus.Pending
                        }
                    };

                await context.Donations.AddRangeAsync(donations);
                await context.SaveChangesAsync();
            }
        }
        if(!context.NewsUpdates.Any())
        {
            List<AppUser> users = [.. context.Users];

            if (users.Any())
            {
                AppUser firstUser = users.First();

                List<NewsUpdate> newsUpdates =
                [
                        new()
                        {
                            Title = "Ukraine Receives International Aid",
                            Content = "Several countries have pledged support to Ukraine in its time of need...",
                            ImageUrl = DEFAULT_IMAGE_URL,
                            ReadingTimeInMinutes = 5,
                            PostedAt = DateTime.UtcNow.AddDays(-1),
                            UserId = firstUser.Id
                        },
                        new()
                        {
                            Title = "Rebuilding Efforts in War-Torn Areas",
                            Content = "Communities are coming together to rebuild homes and infrastructure...",
                            ImageUrl = DEFAULT_IMAGE_URL,
                            ReadingTimeInMinutes = 4,
                            PostedAt = DateTime.UtcNow,
                            UserId = firstUser.Id
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
        var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        string adminUserEmail = "bogsvity777@gmail.com";

        var adminUser = await userManager.FindByEmailAsync(adminUserEmail);
        if (adminUser == null)
        {
            var newAdminUser = new AppUser()
            {
                UserName = "bogsvity777",
                Email = adminUserEmail,
                EmailConfirmed = true,
                PhoneNumber = "+380123456789",
            };
            await userManager.CreateAsync(newAdminUser, "Coding@1234?");
            await userManager.AddToRoleAsync(newAdminUser, UserRoles.Admin);
        }

        string appUserEmail = "user@etickets.com";

        var appUser = await userManager.FindByEmailAsync(appUserEmail);
        if (appUser == null)
        {
            var newAppUser = new AppUser()
            {
                UserName = "app-user",
                Email = appUserEmail,
                EmailConfirmed = true,
                PhoneNumber = "+380123456789",
            };
            await userManager.CreateAsync(newAppUser, "Coding@1234?");
            await userManager.AddToRoleAsync(newAppUser, UserRoles.User);
        }
    }
}
