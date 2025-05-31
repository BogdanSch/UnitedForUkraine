using ContosoUniversity;
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
    Task<int> GetAverageUserDonationsAmountAsync(string? userId);
    Task<int> GetUniqueDonorsCountAsync();
    Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId);
    Task AddAsync(Donation donation);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateAsync(Donation donation);
    Task<bool> SaveAsync();
}
