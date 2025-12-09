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
    Task<int> GetTotalDonationsCountAsync(string? userId = null, DateTime? start = null, DateTime? end = null);
    Task<decimal> GetTotalDonationsAmountAsync(string? userId = null, DateTime? start = null, DateTime? end = null);
    Task<int> GetAverageDonationsAmountAsync(string? userId = null, DateTime? start = null, DateTime? end = null);
    Task<(decimal, CurrencyType)> GetMostFrequentUserDonationAsync(DateTime? start = null, DateTime? end = null);
    Task<decimal> GetSmallestDonationAmountAsync(string? userId = null, DateTime? start = null, DateTime? end = null);
    Task<decimal> GetBiggestDonationAmountAsync(string? userId = null, DateTime? start = null, DateTime? end = null);
    Task<int> GetUniqueDonorsCountAsync(DateTime? start = null, DateTime? end = null);
    Task<string> GetCityWithMostDonationsAsync();
    Task<string> GetCountryWithMostDonationsAsync();
    Task<(string donorName, int donationsCount)> GetMostFrequentDonorInformationAsync(DateTime? start = null, DateTime? end = null);
    Task<decimal> GetDonationsGrowthRateAsync(DateTime period);
    Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId);
    Task<DateTime?> GetFirstDonationDateAsync(string? userId);
    Task<DateTime?> GetLastDonationDateAsync(string? userId);
    Task<bool> DonationExistsForUserAsync(int campaignId, string userId);
    Task<int> GetDonationsCountByCampaingIdAsync(int campaignId);
    Task<decimal> GetReapeatDonorsRate(int campaignId);
    Task AddAsync(Donation donation);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateAsync(Donation donation);
    Task<bool> SaveAsync();
}
