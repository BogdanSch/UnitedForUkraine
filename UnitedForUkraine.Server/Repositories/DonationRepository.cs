using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Services;

namespace UnitedForUkraine.Server.Repositories;

public class DonationRepository : IDonationRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ICurrencyConverterService _currencyConverterService;
    public DonationRepository(ApplicationDbContext context, ICurrencyConverterService currencyConverterService)
    {
        _context = context;
        _currencyConverterService = currencyConverterService;
    }

    public async Task<IEnumerable<Donation>> GetAllDonationsAsync()
    {
        return await _context.Donations.Include(d => d.User).OrderByDescending(d => d.PaymentDate).ToListAsync();
    }
    public IQueryable<Donation> GetAllDonationsByCampaignId(int campaignId)
    {
        return _context.Donations.Where(d => d.CampaignId == campaignId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
    }
    public IQueryable<Donation> GetAllDonationsByUserId(string userId)
    {
        return _context.Donations.Where(d => d.UserId == userId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
    }
    public async Task<Donation?> GetDonationByIdAsync(int id)
    {
        return await _context.Donations.Include(d => d.User).FirstOrDefaultAsync(dontaion => dontaion.Id == id);
    }
    public async Task<IEnumerable<Donation>> GetDonationsAsync(int donationsAmount)
    {
        return await _context.Donations
            .OrderByDescending(d => d.PaymentDate)
            .Take(donationsAmount)
            .ToListAsync();
    }
    public async Task AddAsync(Donation donation)
    {
        await _context.Donations.AddAsync(donation);
        await SaveAsync();
    }
    public async Task<bool> DeleteAsync(int id)
    {
        Donation? donation = await _context.Donations.FindAsync(id);

        if (donation != null)
        {
            _context.Donations.Remove(donation);
            await SaveAsync();
            return true;
        }

        return false;
    }
    public async Task<bool> UpdateAsync(Donation donation)
    {
        _context.Donations.Update(donation);
        return await SaveAsync();
    }

    public async Task<bool> SaveAsync()
    {
        int saved = await _context.SaveChangesAsync();
        return saved > 0;
    }

    public async Task<int> GetTotalUserDonationsCountAsync(string? userId)
    {
        IQueryable<Donation> donations;

        if(userId == null)
        {
            donations = _context.Donations.AsQueryable();
        }
        else
        {
            donations = _context.Donations.Where(d => d.UserId == userId);
        }

        return await donations.CountAsync();
    }

    public async Task<decimal> GetTotalUserDonationsAmountAsync(string? userId)
    {
        IEnumerable<Donation> donations;

        if (userId == null)
        {
            donations = _context.Donations.AsEnumerable();
        }
        else
        {
            donations = _context.Donations.Where(d => d.UserId == userId).AsEnumerable();
        }

        var tasks = donations.Select(async donation =>
            {
                if (donation.Currency == CurrencyType.UAH)
                    return donation.Amount;

                string from = Enum.GetName(donation.Currency)!;
                string to = Enum.GetName(CurrencyType.UAH)!;

                return await _currencyConverterService.ConvertCurrency(donation.Amount, from, to);
            });

        var converted = await Task.WhenAll(tasks);

        return converted.Sum();
    }


    public async Task<int> GetAverageUserDonationsAmountAsync(string? userId)
    {
        int totalDonationsCount = await GetTotalUserDonationsCountAsync(userId);
        decimal totalDonationsAmount = await GetTotalUserDonationsAmountAsync(userId);
        return (int)Math.Round(totalDonationsAmount / totalDonationsCount);
    }
    public async Task<IEnumerable<Campaign>> GetAllUserSupportedCampaigns(string? userId)
    {
        return await _context.Donations.Where(d => d.UserId == userId)
            .Select(d => d.Campaign)
            .Distinct()
            .ToListAsync();
    }
    public async Task<int> GetAllUserSupportedCampaignsCount(string? userId)
    {
        var campaigns = await GetAllUserSupportedCampaigns(userId);
        return campaigns.Count();
    }
    public async Task<int> GetUniqueDonorsCountAsync()
    {
        return await _context.Donations
           .Select(d => d.UserId)
           .Distinct()
           .CountAsync();
    }

    public Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId)
    {
        return _context.Donations
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.CheckoutSessionId == checkoutSessionId);
    }
}
