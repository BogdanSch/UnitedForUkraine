using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface ICampaignRepository
{
    Task<PaginatedList<Campaign>> GetPaginatedCampaigns(QueryObject queryObject, int itemsPerPageCount);
    Task<bool> UpdateExpiredCampaignsAsync();
    Task<bool> UpdateJustStartedCampaignsAsync();
    Task<Campaign?> GetByIdAsync(int id);
    Task AddAsync(Campaign campaign);
    Task<Campaign> DeleteAsync(int id);
    Task<bool> UpdateAsync(Campaign campaign);
    Task<bool> SaveAsync();
    IQueryable<Campaign?> GetAllUserSupportedCampaigns(string? userId);
    Task<int> GetAllUserSupportedCampaignsCount(string? userId);
}
