using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class DonationRepository : IDonationRepository
{
    private readonly ApplicationDbContext _context;
    public DonationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Donation>> GetAllDonations()
    {
        return await _context.Donations.Include(d => d.User).OrderByDescending(d => d.PaymentDate).ToListAsync();
    }
    public IQueryable<Donation> GetAllDonationsByCampaignId(int campaignId)
    {
        return _context.Donations.Where(d => d.CampaignId == campaignId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
    }
    public async Task<Donation> GetDonationById(int id)
    {
        return await _context.Donations.Include(d => d.User).FirstOrDefaultAsync(dontaion => dontaion.Id == id);
    }
    public async Task<IEnumerable<Donation>> GetDonations(int donationsAmount)
    {
        return await _context.Donations
            .OrderByDescending(d => d.PaymentDate)
            .Take(donationsAmount)
            .ToListAsync();
    }
    public async Task<Donation> Add(Donation donation)
    {
        await _context.Donations.AddAsync(donation);
        Save();
        return donation;
    }
    public async Task<Donation> Delete(int id)
    {
        Donation? donation = await _context.Donations.FindAsync(id);

        if (donation != null)
        {
            _context.Donations.Remove(donation);
            Save();
        }

        return donation;
    }
    public bool Update(Donation donation)
    {
        _context.Donations.Update(donation);
        return Save();
    }

    public bool Save()
    {
        int saved = _context.SaveChanges();
        return saved > 0;
    }

    public async Task<int> GetTotalDonationsCount()
    {
        return await _context.Donations.CountAsync();
    }

    public decimal GetTotalDonationsAmount()
    {
        return _context.Donations.Sum(d => (decimal?)d.Amount) ?? 0m;
    }

    public async Task<int> GetAverageDonationsAmount()
    {
        int totalDonationsCount = await GetTotalDonationsCount();
        decimal totalDonationsAmount = GetTotalDonationsAmount();
        return (int)Math.Round(totalDonationsAmount / totalDonationsCount);
    }

    public async Task<int> GetUniqueDonorsCount()
    {
        return await _context.Donations
           .Select(d => d.UserId)
           .Distinct()
           .CountAsync();
    }
}
