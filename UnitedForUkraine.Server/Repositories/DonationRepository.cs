using ContosoUniversity;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class DonationRepository(ApplicationDbContext context, ICurrencyConverterService currencyConverterService) : IDonationRepository
{
    public const string POPULAR_DONATIONS_CITY_NAME = "Kharkiv";
    public const string DEFAULT_FREQUENT_DONOR_NAME = "bogsvity777";
    public const int DEFAULT_FREQUENT_DONOR_COUNT = 100;
    private readonly ApplicationDbContext _context = context;
    private readonly ICurrencyConverterService _currencyConverterService = currencyConverterService;
    public IQueryable<Donation> HandleDonationsFiltering(QueryObject queryObject, IQueryable<Donation> donations)
    {
        if (!string.IsNullOrWhiteSpace(queryObject.SortOrder))
        {
            donations = queryObject.SortOrder switch
            {
                "date_dsc" => donations.OrderByDescending(d => d.PaymentDate),
                "amount_dsc" => donations.OrderByDescending(d => d.Amount),
                "amount_asc" => donations.OrderBy(d => d.Amount),
                "userName_asc" => donations.OrderBy(d => d.User.UserName),
                _ => donations.OrderByDescending(c => c.PaymentDate),
            };
        }
        else
        {
            donations = donations.OrderByDescending(d => d.PaymentDate);
        }

        return donations;
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsAsync(QueryObject queryObject, int itemsPerPageCount)
    {
        IQueryable<Donation> donations = _context.Donations.Include(d => d.User);
        donations = HandleDonationsFiltering(queryObject, donations);

        return await PaginatedList<Donation>.CreateAsync(donations, queryObject.Page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByCampaignId(int campaignId, int page, int itemsPerPageCount)
    {
        var donations = _context.Donations.Where(d => d.CampaignId == campaignId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
        return await PaginatedList<Donation>.CreateAsync(donations, page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByUserId(string userId, QueryObject queryObject, int itemsPerPageCount)
    {
        IQueryable<Donation> donations = _context.Donations.Where(d => d.UserId == userId).Include(d => d.User);
        donations = HandleDonationsFiltering(queryObject, donations);

        return await PaginatedList<Donation>.CreateAsync(donations, queryObject.Page, itemsPerPageCount);
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
    public async Task<string> GetCityWithMostDonationsAsync()
    {
        var popularCity = await _context.Donations.Include(d => d.User)
            .GroupBy(d => d.User.City)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
        return popularCity ?? POPULAR_DONATIONS_CITY_NAME;
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
    public async Task<decimal> GetSmallestDonationAmountAsync(string? userId)
    {
        IQueryable<Donation> donations = _context.Donations.AsQueryable();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            donations = donations.Where(d => d.UserId == userId);
        }

        return await donations.MinAsync(d => d.Amount);
    }
    public async Task<decimal> GetBiggestDonationAmountAsync(string? userId)
    {
        IQueryable<Donation> donations = _context.Donations.AsQueryable();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            donations = donations.Where(d => d.UserId == userId);
        }

        return await donations.MaxAsync(d => d.Amount);
    }
    public async Task<int> GetUniqueDonorsCountAsync()
    {
        return await _context.Donations
           .Select(d => d.UserId)
           .Distinct()
           .CountAsync();
    }
    public async Task<(string donorName, int donationsCount)> GetMostFrequentDonorInformationAsync()
    {
        var result = await _context.Donations.Include(d => d.User)
            .Where(d => !string.IsNullOrWhiteSpace(d.User.UserName))
            .GroupBy(d => d.User.UserName )
            .OrderByDescending(g => g.Count())
            .Select(g => new { Name = g.Key, Count = g.Count() })
            .FirstOrDefaultAsync();

        return result is not null ? (result.Name!, result.Count) : (DEFAULT_FREQUENT_DONOR_NAME, DEFAULT_FREQUENT_DONOR_COUNT);
    }
    public async Task<decimal> GetDonationsGrowthRateAsync(DateTime currentPeriod)
    {
        DateTime previousPeriod = currentPeriod.AddMonths(-1);
        DateTime currentPeriodEnd = currentPeriod.AddMonths(1);

        decimal previousPeriodTotal = await _context.Donations.Where(d => d.PaymentDate >= previousPeriod && d.PaymentDate < currentPeriod)
            .SumAsync(d => d.Amount);
        decimal currentPeriodTotal = await _context.Donations.Where(d => d.PaymentDate >= currentPeriod && d.PaymentDate < currentPeriodEnd)
            .SumAsync(d => d.Amount);

        if (previousPeriodTotal == decimal.Zero)
            return currentPeriodTotal > decimal.Zero ? 100m : decimal.Zero;

        decimal growthRate = Math.Round((currentPeriodTotal - previousPeriodTotal) * 100 / previousPeriodTotal, 2);
        return growthRate;
    }
    public Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId)
    {
        return _context.Donations
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.CheckoutSessionId == checkoutSessionId);
    }
}
