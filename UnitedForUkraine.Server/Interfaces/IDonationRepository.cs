using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IDonationRepository
{
    IQueryable<Donation> HandleDonationsFiltering(QueryObject queryObject, IQueryable<Donation> donations);
    Task<PaginatedList<Donation>> GetPaginatedDonationsAsync(QueryObject queryObject, int itemsPerPageCount);
    Task<PaginatedList<Donation>> GetPaginatedDonationsByCampaignId(int campaignId, int page, int itemsPerPageCount);
    Task<PaginatedList<Donation>> GetPaginatedDonationsByUserId(string userId, QueryObject queryObject, int itemsPerPageCount);
    Task<Donation?> GetDonationByIdAsync(int id);
    Task<int> GetTotalUserDonationsCountAsync(string? userId);
    Task<decimal> GetTotalUserDonationsAmountAsync(string? userId);
    Task<decimal> GetMostFrequentUserDonationAmountAsync();
    Task<int> GetAverageUserDonationsAmountAsync(string? userId);
    Task<decimal> GetSmallestDonationAmountAsync(string? userId);
    Task<decimal> GetBiggestDonationAmountAsync(string? userId);
    Task<int> GetUniqueDonorsCountAsync();
    Task<string> GetCityWithMostDonationsAsync();
    Task<(string donorName, int donationsCount)> GetMostFrequentDonorInformationAsync();
    Task<decimal> GetDonationsGrowthRateAsync(DateTime period);
    Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId);
    Task<DateTime?> GetFirstDonationDateAsync(string? userId);
    Task<DateTime?> GetLastDonationDateAsync(string? userId);
    Task AddAsync(Donation donation);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateAsync(Donation donation);
    Task<bool> SaveAsync();
}
