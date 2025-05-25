using ContosoUniversity;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface ICampaignRepository
{
    Task<PaginatedList<Campaign>> GetPaginatedCampaigns(QueryObject queryObject, int itemsPerPageCount);
    Task<Campaign?> GetCampaignByIdAsync(int id);
    Task AddAsync(Campaign campaign);
    Task<Campaign> DeleteAsync(int id);
    Task<bool> UpdateAsync(Campaign campaign);
    Task<bool> SaveAsync();
    IQueryable<Campaign> GetAllUserSupportedCampaigns(string? userId);
    Task<int> GetAllUserSupportedCampaignsCount(string? userId);
}
