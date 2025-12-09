using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<Receipt> Receipts => Set<Receipt>();
    public DbSet<NewsUpdate> NewsUpdates => Set<NewsUpdate>();
    public DbSet<CampaignLike> CampaignLikes => Set<CampaignLike>();
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Donation>()
            .HasOne(d => d.User)
            .WithMany()
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Donation>()
            .HasOne(d => d.Campaign)
            .WithMany(c => c.Donations)
            .HasForeignKey(d => d.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Donation>()
            .HasOne(d => d.Receipt)
            .WithOne(r => r.Donation)
            .HasForeignKey<Receipt>(r => r.DonationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<NewsUpdate>()
            .HasOne(n => n.TargetCampaign)
            .WithMany(c => c.NewsUpdates)
            .HasForeignKey(n => n.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Address>()
            .HasOne(a => a.User)
            .WithOne(u => u.Address)
            .HasForeignKey<Address>(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CampaignLike>()
            .HasKey(cl => new { cl.LikedCampaignId, cl.UserId });
        builder.Entity<CampaignLike>()
            .HasOne(cl => cl.User)
            .WithMany()
            .HasForeignKey(cl => cl.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Entity<CampaignLike>()
            .HasOne(cl => cl.LikedCampaign)
            .WithMany()
            .HasForeignKey(cl => cl.LikedCampaignId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
