using Microsoft.EntityFrameworkCore;
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
        return await _context.Donations.OrderByDescending(d => d.PaymentDate).ToListAsync();
    }
    public async Task<Donation?> GetDonationById(int id)
    {
        return await _context.Donations.FirstOrDefaultAsync(dontaion => dontaion.Id == id);
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
        await Save();
        return donation;
    }
    public async Task<Donation?> Delete(int id)
    {
        Donation? donation = await _context.Donations.FindAsync(id);

        if (donation != null)
        {
            _context.Donations.Remove(donation);
            await Save();
        }

        return donation;
    }
    public async Task<bool> Update(Donation donation)
    {
        _context.Donations.Update(donation);
        return await Save();
    }

    public async Task<bool> Save()
    {
        int saved = _context.SaveChanges();
        return saved > 0;
    }
}
