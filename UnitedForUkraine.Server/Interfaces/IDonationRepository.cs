using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IDonationRepository
{
    Task<IEnumerable<Donation>> GetAllDonationsAsync();
    IQueryable<Donation> GetAllDonationsByCampaignId(int campaignId);
    IQueryable<Donation> GetAllDonationsByUserId(string userId);
    Task<IEnumerable<Donation>> GetDonationsAsync(int donationsAmount);
    Task<Donation?> GetDonationByIdAsync(int id);
    Task<int> GetTotalUserDonationsCountAsync(string? userId);
    Task<decimal> GetTotalUserDonationsAmountAsync(string? userId);
    Task<int> GetAverageUserDonationsAmountAsync(string? userId);
    Task<IEnumerable<Campaign>> GetAllUserSupportedCampaigns(string? userId);
    Task<int> GetAllUserSupportedCampaignsCount(string? userId);
    Task<int> GetUniqueDonorsCountAsync();
    Task<Donation?> GetDonationByCheckoutSessionId(string checkoutSessionId);
    Task<Donation> AddAsync(Donation donation);
    Task<bool> DeleteAsync(int id);
    bool Update(Donation donation);
    bool Save();
}
