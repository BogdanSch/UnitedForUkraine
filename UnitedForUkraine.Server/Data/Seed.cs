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
                    Preview = "We have successfully purchased 150 sets of thermal underwear and three thermal imagers for the 3rd Corps. This critical aid arrives just in time for the drop in temperatures.",
                    Content = "<p>The funds raised during this campaign went directly towards purchasing <strong>150 sets of thermal underwear</strong>, warm sleeping bags, and three high-grade thermal imagers. This is critically important aid for our defenders ahead of the cold weather.</p><p>In addition to the basics, we focused on specific requests from the unit commander:</p><ul><li>20 sets of winter camouflage nets.</li><li>Heated insoles for sentries on night watch.</li><li>Tactical gloves suitable for sub-zero temperatures.</li></ul><p>Feedback from the front lines indicates that these supplies have already been distributed to the positions where they are needed most.</p>",
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
                    Preview = "Thanks to your support, we have ordered a modern ultrasound machine for the central district hospital in a liberated city. We expect delivery and installation within the next month.",
                    Content = "<p>Thanks to the successful completion of the first fundraising stage, we were able to order a modern ultrasound machine for the central district hospital in a liberated city. Delivery is expected next month, pending customs clearance.</p><p>This specific model was chosen for its distinct advantages:</p><ul><li><strong>High portability:</strong> It can be moved between wards easily.</li><li><strong>High resolution:</strong> Crucial for diagnosing internal trauma quickly.</li><li><strong>Battery backup:</strong> Functional even during power outages.</li></ul><p>Once installed, our medical volunteers will conduct a training session for the local staff to ensure the equipment is used to its full potential.</p>",
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
                    Preview = "The first 20 IT students affected by the war have received scholarships and new laptops. This initiative aims to secure the future of our country's tech industry.",
                    Content = "<p>Our goal is to support talented youth who have been displaced or affected by the conflict. The first <strong>20 IT students</strong> have received not only full semester scholarships but also new laptops to continue their studies.</p><p>The selection process was rigorous, involving over 200 applicants. The chosen students demonstrated:</p><ol><li>High academic performance despite challenging circumstances.</li><li>A strong portfolio of personal coding projects.</li><li>A clear vision for how they want to contribute to Ukraine's digital infrastructure.</li></ol><p>We are also partnering with software companies to provide free licenses for essential development tools.</p>",
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
                    Preview = "We have dispatched 500 individual medical kits to the frontline to assist civilians and defenders. Distribution is being handled efficiently by local volunteer hubs.",
                    Content = "<p>Our team has purchased and assembled <strong>500 individual medical kits</strong> containing essential medicines and first aid supplies. Distribution is carried out through local volunteer hubs located in the 'grey zones'.</p><p>Each kit is tailored to treat common injuries and includes:</p><ul><li>Certified CAT Tourniquets.</li><li>Hemostatic bandages (Celox or equivalent).</li><li>Basic antibiotics and painkillers.</li><li>Thermal blankets for shock management.</li></ul><p>Our logistics partners have confirmed that the convoy safely passed the checkpoints and distribution began this morning.</p>",
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
                    Preview = "We have partnered with local ISPs to provide free high-speed internet to 50 students in rural areas. This ensures they can continue their education remotely without interruption.",
                    Content = "<p>We've partnered with local ISPs to provide free, high-speed internet access to <strong>50 students</strong> living in rural areas. This bridges the digital divide created by infrastructure damage.</p><p>The project involved several key steps:</p><ol><li>Identifying households with students that lost connection due to shelling.</li><li>Installing Starlink terminals or repairing fiber optic lines where possible.</li><li>Pre-paying service fees for the entire academic year.</li></ol><p>Students can now attend virtual lectures and complete assignments without interruption. One student noted, <em>'I was finally able to take my mid-term exam thanks to the stable connection.'</em></p>",
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
                    Preview = "Our latest shipment of 100 specialized thermal blankets and 20 field heaters has reached the Eastern front. This gear provides immediate protection against freezing temperatures.",
                    Content = "<p>Our latest shipment successfully delivered <strong>100 specialized thermal blankets</strong> and <strong>20 field heaters</strong> directly to the forward operating bases in the East. This rapid deployment ensures immediate protection against the upcoming freezing temperatures.</p><p>The equipment sent includes:</p><ul><li><strong>Multi-fuel heaters:</strong> Capable of running on diesel, wood, or coal.</li><li><strong>Carbon Monoxide detectors:</strong> To ensure safety in enclosed dugouts.</li><li><strong>Heavy-duty sleeping mats:</strong> To provide insulation from the frozen ground.</li></ul><p>We are immensely grateful to the drivers who navigated difficult terrain to ensure this delivery arrived on time.</p>",
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
