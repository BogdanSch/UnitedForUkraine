using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class DonationRepository(ApplicationDbContext context, ICurrencyConverterService currencyConverterService) : IDonationRepository
{
    public const string DEFAULT_CITY_NAME = "Kharkiv";
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
        IQueryable<Donation> donations = _context.Donations.Include(d => d.User).AsQueryable();
        donations = HandleDonationsFiltering(queryObject, donations);

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
        donations = HandleDonationsFiltering(queryObject, donations);

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
    public async Task<string> GetCityWithMostDonationsAsync()
    {
        string? popularCity = await _context.Donations.Include(d => d.User)
            .Include(d => d.User.Address)
            .GroupBy(d => d.User.Address == null ? DEFAULT_CITY_NAME : (d.User.Address.City ?? DEFAULT_CITY_NAME))
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
        if (string.IsNullOrWhiteSpace(popularCity))
            return DEFAULT_CITY_NAME;

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
    public async Task<int> GetAverageDonationsAmountAsync(string? userId = null)
    {
        int totalDonationsCount = await GetTotalDonationsCountAsync(userId);
        decimal totalDonationsAmount = await GetTotalDonationsAmountAsync(userId);

        if (totalDonationsCount == 0) return 0;

        return (int)Math.Round(totalDonationsAmount / totalDonationsCount);
    }
    public async Task<decimal> GetMostFrequentUserDonationAmountAsync()
    {
        return await _context.Donations.GroupBy(d => d.Amount)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
    }
    public async Task<decimal> GetSmallestDonationAmountAsync(string? userId)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);

        if (!donations.Any())
            return decimal.Zero;

        Donation? smallestDonation = await donations.OrderBy(d => d.Amount).FirstOrDefaultAsync();

        if (smallestDonation is null)
            return decimal.Zero;

        string from = Enum.GetName(smallestDonation.Currency)!;
        string to = Enum.GetName(CurrencyType.UAH)!;

        return await _currencyConverterService.ConvertCurrency(smallestDonation.Amount, from, to);
    }
    public async Task<decimal> GetBiggestDonationAmountAsync(string? userId)
    {
        IQueryable<Donation> donations = GetDonationsQuery(userId);

        if (!donations.Any())
            return decimal.Zero;

        Donation? biggestDonation = await donations.OrderByDescending(d => d.Amount).FirstOrDefaultAsync();

        if (biggestDonation is null)
            return decimal.Zero;

        string from = Enum.GetName(biggestDonation.Currency)!;
        string to = Enum.GetName(CurrencyType.UAH)!;

        return await _currencyConverterService.ConvertCurrency(biggestDonation.Amount, from, to);
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
