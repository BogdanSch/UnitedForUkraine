using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Data;

public class ApplicationDbContext : IdentityDbContext<AppUser>
{
     public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<Donation> Donations { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<NewsUpdate> NewsUpdates { get; set; }

}
