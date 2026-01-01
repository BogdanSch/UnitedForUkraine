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
                    Title = "Rebuild Kharkiv Schools",
                    Slogan = "Help restore hope for children",
                    Description = "We are raising funds to rebuild and equip damaged schools in Kharkiv after the recent attacks.",
                    GoalAmount = 70000.00m,
                    RaisedAmount = 0m,
                    Currency = CurrencyType.UAH,
                    Status = CampaignStatus.Ongoing, 
                    Category = CampaignCategory.Education,
                    StartDate = new DateTime(2025, 11, 6, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 1, 6, 0, 0, 0, DateTimeKind.Utc),
                    ImageUrl = "https://res.cloudinary.com/danl4sj0w/image/upload/v1763576461/hthqfndffmkb5rsvyrz1.jpg",
                    DonorsCount = 0
                },
                new()
                {
                    Title = "Medical Aid for Frontline Civilians",
                    Slogan = "Every life matters",
                    Description = "Funds collected will be used to provide first aid kits and medicines to civilians in frontline regions.",
                    GoalAmount = 20000.00m,
                    RaisedAmount = 0m,
                    Currency = CurrencyType.USD,
                    Status = CampaignStatus.Ongoing,
                    Category = CampaignCategory.Health,
                    StartDate = new DateTime(2025, 11, 6, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 2, 6, 0, 0, 0, DateTimeKind.Utc),
                    ImageUrl = "https://res.cloudinary.com/danl4sj0w/image/upload/v1767187177/wa4bvp5hk7avdsir4ymc.jpg",
                    DonorsCount = 0
                },
                new()
                {
                    Title = "Winter Relief for our soldiers",
                    Slogan = "Warmth in every home",
                    Description = "Our goal is to supply warm clothes, blankets, and heating equipment for our warriors before winter.",
                    GoalAmount = 400000.00m,
                    RaisedAmount = 0m,
                    Currency = CurrencyType.UAH,
                    Status = CampaignStatus.Ongoing,
                    Category = CampaignCategory.Military,
                    StartDate = new DateTime(2025, 11, 6, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 3, 6, 0, 0, 0, DateTimeKind.Utc),
                    ImageUrl = "https://res.cloudinary.com/danl4sj0w/image/upload/v1767187261/mr11emqcxjflxily7zpt.jpg",
                    DonorsCount = 0
                },
                new()
                {
                    Title = "Rebuild Local Hospitals",
                    Slogan = "Stronger healthcare for Ukraine",
                    Description = "We are funding repairs and equipment replacement for hospitals in liberated areas.",
                    GoalAmount = 75000.00m,
                    RaisedAmount = 0m,
                    Currency = CurrencyType.UAH,
                    Status = CampaignStatus.Ongoing,
                    Category = CampaignCategory.Health,
                    StartDate = new DateTime(2025, 11, 6, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 5, 6, 0, 0, 0, DateTimeKind.Utc),
                    ImageUrl = "https://res.cloudinary.com/danl4sj0w/image/upload/v1763577005/gbl0ooam3wfiuxxani7s.jpg",
                    DonorsCount = 0
                },
                new()
                {
                    Title = "Support Ukrainian Tech Students",
                    Slogan = "Build the future through education",
                    Description = "This campaign provides laptops, internet access, and scholarships to talented tech students affected by the war.",
                    GoalAmount = 15000.00m,
                    RaisedAmount = 0.00m,
                    Currency = CurrencyType.EUR,
                    Status = CampaignStatus.Ongoing,
                    Category = CampaignCategory.Education,
                    StartDate = new DateTime(2025, 11, 6, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 4, 6, 0, 0, 0, DateTimeKind.Utc),
                    ImageUrl = "https://res.cloudinary.com/danl4sj0w/image/upload/v1763577160/bk73obivoupbxychlvsi.jpg",
                    DonorsCount = 0
                }
            ];

            await context.Campaigns.AddRangeAsync(newCampaigns);
            await context.SaveChangesAsync();
        }

        AppUser? firstUser = await context.Users.FirstOrDefaultAsync();
        List<Campaign> campaigns = await context.Campaigns.AsNoTracking().ToListAsync();
        if (!context.NewsUpdates.Any() && firstUser is not null && campaigns.Count != 0)
        {
            var campaignMap = campaigns.ToDictionary(c => c.Title, c => c.Id);
            string authorId = firstUser.Id;

            List<NewsUpdate> newsUpdates =
            [
                new()
                {
                    Title = "Winter Defense: Thermal Imagers and Clothing for the 3rd Corps",
                    KeyWords = "Winter, Military, Clothing, ThermalImagers, Aid",
                    Content = "The funds raised went towards purchasing 150 sets of thermal underwear, warm sleeping bags, and three thermal imagers. This is critically important aid for our defenders ahead of the cold weather.",
                    ImageUrl = DEFAULT_IMAGE_URL,
                    ReadingTimeInMinutes = 5,
                    PostedAt = new DateTime(2025, 12, 3, 18, 53, 22, 913, DateTimeKind.Utc),
                    AuthorId = authorId,
                    CampaignId = campaignMap["Winter Relief for our soldiers"],
                    ViewsCount = 0
                },
                new()
                {
                    Title = "Health for the Regions: New Ultrasound Machine Ordered",
                    KeyWords = "Hospitals, Equipment, Ultrasound, Restoration, Medicine",
                    Content = "Thanks to the successful completion of the first fundraising stage, we were able to order a modern ultrasound machine for the central district hospital in a liberated city. Delivery is expected next month.",
                    ImageUrl = DEFAULT_IMAGE_URL,
                    ReadingTimeInMinutes = 3,
                    PostedAt = new DateTime(2025, 12, 4, 6, 53, 22, 913, DateTimeKind.Utc),
                    AuthorId = authorId,
                    CampaignId = campaignMap["Rebuild Local Hospitals"],
                    ViewsCount = 0
                },
                new()
                {
                    Title = "IT Future: Scholarships Awarded to First 20 Students",
                    KeyWords = "Education, Students, Technology, Scholarships, Support",
                    Content = "Our goal is to support talented youth. The first 20 IT students affected by the war have received not only scholarships but also new laptops to continue their studies.",
                    ImageUrl = DEFAULT_IMAGE_URL,
                    ReadingTimeInMinutes = 4,
                    PostedAt = new DateTime(2025, 11, 29, 18, 53, 22, 913, DateTimeKind.Utc),
                    AuthorId = authorId,
                    CampaignId = campaignMap["Support Ukrainian Tech Students"],
                    ViewsCount = 0
                },
                new()
                {
                    Title = "Medical Aid: 500 First Aid Kits Dispatched to the Frontline",
                    KeyWords = "Medicine, Frontline, FirstAid, Civilians, Aid",
                    Content = "Our team has purchased and assembled 500 individual medical kits containing essential medicines and first aid supplies. Distribution is carried out through local volunteer hubs.",
                    ImageUrl = DEFAULT_IMAGE_URL,
                    ReadingTimeInMinutes = 4,
                    PostedAt = new DateTime(2025, 12, 2, 18, 54, 38, 190, DateTimeKind.Utc),
                    AuthorId = authorId,
                    CampaignId = campaignMap["Medical Aid for Frontline Civilians"],
                    ViewsCount = 0
                },
                new()
                {
                    Title = "Internet Access Secured for 50 Rural Students",
                    KeyWords = "Internet, Tech, Students, Rural Support, Education",
                    Content = "We've partnered with local ISPs to provide free, high-speed internet access to 50 students living in rural areas, ensuring they can attend virtual lectures and complete assignments without interruption. This bridges the digital divide created by infrastructure damage.",
                    ImageUrl = DEFAULT_IMAGE_URL,
                    ReadingTimeInMinutes = 3,
                    PostedAt = new DateTime(2025, 12, 1, 18, 59, 51, 393, DateTimeKind.Utc),
                    AuthorId = authorId,
                    CampaignId = campaignMap["Support Ukrainian Tech Students"],
                    ViewsCount = 0
                },
                new()
                {
                    Title = "Thermal Blankets Reach Eastern Front Positions",
                    KeyWords = "Heating, Blankets, Logistics, Frontline, Winter",
                    Content = "Our latest shipment successfully delivered 100 specialized thermal blankets and 20 field heaters directly to the forward operating bases in the East. This rapid deployment ensures immediate protection against the upcoming freezing temperatures.",
                    ImageUrl = "https://res.cloudinary.com/danl4sj0w/image/upload/v1764871711/pwrvrxkqszkz1qp9hwyc.png",
                    ReadingTimeInMinutes = 3,
                    PostedAt = new DateTime(2025, 12, 4, 18, 8, 35, 639, DateTimeKind.Utc),
                    AuthorId = authorId,
                    CampaignId = campaignMap["Winter Relief for our soldiers"],
                    ViewsCount = 0
                }
            ];

            await context.NewsUpdates.AddRangeAsync(newsUpdates);
            await context.SaveChangesAsync();
        }
    }
    public static async Task SeedUsersAndRolesAsync(IApplicationBuilder applicationBuilder)
    {
        using var serviceScope = applicationBuilder.ApplicationServices.CreateScope();
        //Roles
        RoleManager<IdentityRole> roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
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
                PhoneNumber = "+380 123 456 789",
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
                PhoneNumber = "+380 123 456 789",
                RegisteredAt = DateTime.UtcNow,
                Address = new Address(),
            };
            await userManager.CreateAsync(newAppUser, "Coding@1234?");
            await userManager.AddToRoleAsync(newAppUser, UserRoles.User);
        }
    }
}
