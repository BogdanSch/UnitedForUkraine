using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IDonationRepository
{
    Task<PaginatedList<Donation>> GetPaginatedDonationsAsync(QueryObject queryObject, int itemsPerPageCount);
    Task<PaginatedList<Donation>> GetPaginatedDonationsByCampaignId(int campaignId, int page, int itemsPerPageCount);
    Task<PaginatedList<Donation>> GetPaginatedDonationsByNewsUpdate(NewsUpdate newsUpdate, int page, int itemsPerPageCount);
    Task<PaginatedList<Donation>> GetPaginatedDonationsByUserId(string userId, QueryObject queryObject, int itemsPerPageCount);
    Task<Donation?> GetByIdAsync(int id);
    Task<int> GetTotalDonationsCountAsync(string? userId = null);
    Task<decimal> GetTotalDonationsAmountAsync(string? userId = null);
    Task<int> GetAverageDonationsAmountAsync(string? userId = null);
    Task<(decimal, CurrencyType)> GetMostFrequentUserDonationAsync();
    Task<decimal> GetSmallestDonationAmountAsync(string? userId = null);
    Task<decimal> GetBiggestDonationAmountAsync(string? userId = null);
    Task<int> GetUniqueDonorsCountAsync();
    Task<string> GetCityWithMostDonationsAsync();
    Task<string> GetCountryWithMostDonationsAsync();
    Task<(string donorName, int donationsCount)> GetMostFrequentDonorInformationAsync();
    Task<decimal> GetDonationsGrowthRateAsync(DateTime period);
    Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId);
    Task<DateTime?> GetFirstDonationDateAsync(string? userId);
    Task<DateTime?> GetLastDonationDateAsync(string? userId);
    Task<bool> DonationExistsForUserAsync(int campaignId, string userId);
    Task AddAsync(Donation donation);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateAsync(Donation donation);
    Task<bool> SaveAsync();
}
