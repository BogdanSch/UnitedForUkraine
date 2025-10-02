using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<Donation> Donations { get; set; }
    public DbSet<NewsUpdate> NewsUpdates { get; set; }
}
