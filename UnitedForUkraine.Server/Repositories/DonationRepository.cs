using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class DonationRepository(ApplicationDbContext context, ICurrencyConverterService currencyConverterService) : IDonationRepository
{
    public const string DEFAULT_CITY_NAME = "Kharkiv";
    public const string DEFAULT_COUNTRY_NAME = "Ukraine";
    public const string DEFAULT_FREQUENT_DONOR_NAME = "bogsvity777";
    public const int DEFAULT_DONATIONS_COUNT = 100;
    private readonly ApplicationDbContext _context = context;
    private readonly ICurrencyConverterService _currencyConverterService = currencyConverterService;
    private static IQueryable<Donation> ApplyDonationsFilters(QueryObject queryObject, IQueryable<Donation> donations)
    {
        if(!string.IsNullOrWhiteSpace(queryObject.Currencies))
        {
            string[] currencyList = queryObject.Currencies.Split('+', StringSplitOptions.RemoveEmptyEntries);
            HashSet<CurrencyType> parsedCurrencies = [];

            foreach (var cur in currencyList)
            {
                if (Enum.TryParse<CurrencyType>(cur.Trim(), out CurrencyType result))
                    parsedCurrencies.Add(result);
            }

            if (parsedCurrencies.Count != 0)
                donations = donations.Where(d => parsedCurrencies.Contains(d.Currency));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.CampaignIds))
        {
            string[] campaignIds = queryObject.CampaignIds.Split('+', StringSplitOptions.RemoveEmptyEntries);
            if (campaignIds.Length != 0)
                donations = donations.Where(d => campaignIds.Contains(d.CampaignId.ToString()));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.StartDate) && !string.IsNullOrWhiteSpace(queryObject.EndDate))
        {
            (DateTime start, DateTime end) = DateSettings.ParseStartAndEndDate(queryObject.StartDate, queryObject.EndDate);
            donations = donations.Where(d => d.PaymentDate >= start && d.PaymentDate <= end);
        }
        if (!string.IsNullOrWhiteSpace(queryObject.SortOrder))
        {
            donations = queryObject.SortOrder switch
            {
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
        IQueryable<Donation> donations = _context.Donations.Include(d => d.User).AsQueryable();
        donations = ApplyDonationsFilters(queryObject, donations);
        return await PaginatedList<Donation>.CreateAsync(donations, queryObject.Page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByCampaignId(int campaignId, int page, int itemsPerPageCount)
    {
        var donations = _context.Donations.Where(d => d.CampaignId == campaignId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
        return await PaginatedList<Donation>.CreateAsync(donations, page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByNewsUpdate(NewsUpdate newsUpdate, int page, int itemsPerPageCount)
    {
        var donations = _context.Donations.Where(d => d.CampaignId == newsUpdate.CampaignId).Include(d => d.User).OrderByDescending(d => d.PaymentDate);
        return await PaginatedList<Donation>.CreateAsync(donations, page, itemsPerPageCount);
    }
    public async Task<PaginatedList<Donation>> GetPaginatedDonationsByUserId(string userId, QueryObject queryObject, int itemsPerPageCount)
    {
        IQueryable<Donation> donations = _context.Donations.Where(d => d.UserId == userId).Include(d => d.User);
        donations = ApplyDonationsFilters(queryObject, donations);
        return await PaginatedList<Donation>.CreateAsync(donations, queryObject.Page, itemsPerPageCount);
    }
    public async Task<Donation?> GetByIdAsync(int id)
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

        if (donation is not null)
        {
            _context.Donations.Remove(donation);
            return await SaveAsync();
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
    public async Task<bool> DonationExistsForUserAsync(int campaignId, string userId)
    {
        return await _context.Donations.AnyAsync(d => d.CampaignId == campaignId && d.UserId == userId);
    }
    public async Task<string> GetCityWithMostDonationsAsync()
    {
        string? popularCity = await _context.Donations.Include(d => d.User)
            .Include(d => d.User.Address)
            .GroupBy(d => d.User.Address.City ?? DEFAULT_CITY_NAME)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
        if (string.IsNullOrWhiteSpace(popularCity))
            return DEFAULT_CITY_NAME;

        return popularCity;
    }
    public async Task<string> GetCountryWithMostDonationsAsync()
    {
        string? popularCity = await _context.Donations.Include(d => d.User)
            .Include(d => d.User.Address)
            .GroupBy(d => d.User.Address.Country ?? DEFAULT_COUNTRY_NAME)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
        if (string.IsNullOrWhiteSpace(popularCity))
            return DEFAULT_COUNTRY_NAME;

        return popularCity;
    }
    private IQueryable<Donation> GetDonationsQuery(string? userId)
    {
        IQueryable<Donation> query = _context.Donations.AsQueryable();
        if (!string.IsNullOrWhiteSpace(userId))
        {
            query = query.Where(d => d.UserId == userId);
        }
        return query;
    }
    public async Task<int> GetTotalDonationsCountAsync(string? userId = null) => await GetDonationsQuery(userId).CountAsync();
    public async Task<decimal> GetTotalDonationsAmountAsync(string? userId = null)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);

        var temp = donations.Select(d => new { d.Amount, d.Currency }).ToList();
        var tasks = temp.Select(async d => await ConvertToUahAsync(d.Amount, d.Currency));

        decimal[] converted = await Task.WhenAll(tasks);
        return converted.Sum();
    }
    public async Task<int> GetAverageDonationsAmountAsync(string? userId = null)
    {
        int totalDonationsCount = await GetTotalDonationsCountAsync(userId);
        decimal totalDonationsAmount = await GetTotalDonationsAmountAsync(userId);

        if (totalDonationsCount == 0) return 0;
        return (int)Math.Round(totalDonationsAmount / totalDonationsCount);
    }
    public async Task<(decimal, CurrencyType)> GetMostFrequentUserDonationAsync()
    {
        var mode = await _context.Donations.GroupBy(d => new {d.Amount, d.Currency})
            .OrderByDescending(g => g.Count())
            .Select(g => new { g.Key.Amount, g.Key.Currency })
            .FirstOrDefaultAsync();
        return mode is null ? (0, CurrencyType.UAH) : (mode.Amount, mode.Currency);
    }
    public async Task<decimal> GetSmallestDonationAmountAsync(string? userId = null)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);
        Donation? smallestDonation = await donations.OrderBy(d => d.Amount).FirstOrDefaultAsync();
        
        if (smallestDonation is null)
            return decimal.Zero;
        return await ConvertToUahAsync(smallestDonation.Amount, smallestDonation.Currency);
    }
    public async Task<decimal> GetBiggestDonationAmountAsync(string? userId = null)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);
        Donation? biggestDonation = await donations.OrderByDescending(d => d.Amount).FirstOrDefaultAsync();

        if (biggestDonation is null) return decimal.Zero;
        return await ConvertToUahAsync(biggestDonation.Amount, biggestDonation.Currency);
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

        return result is not null ? (result.Name!, result.Count) : (DEFAULT_FREQUENT_DONOR_NAME, DEFAULT_DONATIONS_COUNT);
    }
    public async Task<decimal> GetDonationsGrowthRateAsync(DateTime currentPeriod)
    {
        DateTime previousPeriod = currentPeriod.AddMonths(-1);
        DateTime currentPeriodEnd = currentPeriod.AddMonths(1);

        var previousPeriodResults = await _context.Donations
            .Where(d => d.PaymentDate >= previousPeriod && d.PaymentDate < currentPeriod)
            .Select(d => new { d.Amount, d.Currency }).ToListAsync();
        decimal previousPeriodTotal = (await Task.WhenAll(previousPeriodResults.Select(async d => await ConvertToUahAsync(d.Amount, d.Currency)))).Sum();

        var currentPeriodResults = await _context.Donations
            .Where(d => d.PaymentDate >= currentPeriod && d.PaymentDate < currentPeriodEnd)
            .Select(d => new { d.Amount, d.Currency }).ToListAsync();
        decimal currentPeriodTotal = (await Task.WhenAll(currentPeriodResults.Select(async d => await ConvertToUahAsync(d.Amount, d.Currency)))).Sum();

        if (previousPeriodTotal == decimal.Zero)
            return currentPeriodTotal > decimal.Zero ? 100m : decimal.Zero;

        decimal growthRate = Math.Round((currentPeriodTotal - previousPeriodTotal) * 100 / previousPeriodTotal, 2);

        return growthRate > 100 ? 100 : growthRate;
    }
    private async Task<decimal> ConvertToUahAsync(decimal amount, CurrencyType currency)
    {
        if (currency == CurrencyType.UAH)
            return amount;

        string from = Enum.GetName(currency)!;
        string to = Enum.GetName(CurrencyType.UAH)!;

        return await _currencyConverterService.ConvertCurrency(amount, from, to);
    }
    public async Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId)
    {
        return await _context.Donations.Include(d => d.User)
            .FirstOrDefaultAsync(d => d.CheckoutSessionId == checkoutSessionId);
    }
    public async Task<DateTime?> GetFirstDonationDateAsync(string? userId)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);

        if(!donations.Any())
            return null;

        return await donations.MinAsync(d => d.PaymentDate); 
    }
    public async Task<DateTime?> GetLastDonationDateAsync(string? userId)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);

        if (!donations.Any())
            return null;

        return await donations.MaxAsync(d => d.PaymentDate);
    }
}
