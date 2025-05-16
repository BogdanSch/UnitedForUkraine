using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface ICampaignRepository
{
    IQueryable<Campaign> GetAllCampaigns(QueryObject queryObject);
    Task<IEnumerable<Campaign>> GetCampaignsAsync(int campaignsAmount);
    Task<Campaign?> GetCampaignByIdAsync(int id);
    Task AddAsync(Campaign campaign);
    Task<Campaign> DeleteAsync(int id);
    Task<bool> UpdateAsync(Campaign campaign);
    Task<bool> SaveAsync();
}
