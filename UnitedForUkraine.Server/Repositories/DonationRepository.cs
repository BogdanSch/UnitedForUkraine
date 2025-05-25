using ContosoUniversity;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

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

    public async Task<PaginatedList<Donation>> GetPaginatedDonationsAsync(QueryObject queryObject, int itemsPerPageCount)
    {
        var donations = _context.Donations.Include(d => d.User).OrderByDescending(d => d.PaymentDate);
        return await PaginatedList<Donation>.CreateAsync(donations, queryObject.Page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByCampaignId(int campaignId, int page, int itemsPerPageCount)
    {
        var donations = _context.Donations.Where(d => d.CampaignId == campaignId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
        return await PaginatedList<Donation>.CreateAsync(donations, page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByUserId(string userId, int page, int itemsPerPageCount)
    {
        var donations = _context.Donations.Where(d => d.UserId == userId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
        return await PaginatedList<Donation>.CreateAsync(donations, page, itemsPerPageCount);
    }
    public async Task<Donation?> GetDonationByIdAsync(int id)
    {
        return await _context.Donations.Include(d => d.User).FirstOrDefaultAsync(dontaion => dontaion.Id == id);
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
        IQueryable<Donation> donations;

        if (userId == null)
        {
            donations = _context.Donations;
        }
        else
        {
            donations = _context.Donations.Where(d => d.UserId == userId);
        }

        var temp = donations.Select(d => new { d.Amount, d.Currency }).ToList();

        var tasks = temp.Select(async donation =>
            {
                if (donation.Currency == CurrencyType.UAH)
                    return donation.Amount;

                string from = Enum.GetName(donation.Currency)!;
                string to = Enum.GetName(CurrencyType.UAH)!;

                return await _currencyConverterService.ConvertCurrency(donation.Amount, from, to);
            });

        decimal[] converted = await Task.WhenAll(tasks);

        return converted.Sum();
    }
    public async Task<int> GetAverageUserDonationsAmountAsync(string? userId)
    {
        int totalDonationsCount = await GetTotalUserDonationsCountAsync(userId);
        decimal totalDonationsAmount = await GetTotalUserDonationsAmountAsync(userId);

        if (totalDonationsCount == 0) return 0;

        return (int)Math.Round(totalDonationsAmount / totalDonationsCount);
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
