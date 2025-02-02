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

    public Task<Donation> AddDonation(Donation donation)
    {
        throw new NotImplementedException();
    }

    public Task<Donation> DeleteDonation(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Donation>> GetAllDonations()
    {
        return await _context.Donations.ToListAsync();
    }

    public Task<Donation> GetDonation(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Donation>> GetDonations(int donationsAmount)
    {
        throw new NotImplementedException();
    }

    public bool UpdateDonation(Donation donation)
    {
        throw new NotImplementedException();
    }
}
