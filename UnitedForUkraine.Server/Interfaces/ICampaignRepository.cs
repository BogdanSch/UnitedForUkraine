using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface ICampaignRepository
{
    IQueryable<Campaign> GetAllCampaigns();
    Task<IEnumerable<Campaign>> GetCampaigns(int campaignsAmount);
    Task<Campaign> GetCampaignById(int id);
    Task<Campaign> Add(Campaign campaign);
    Task<Campaign> Delete(int id);
    bool Update(Campaign campaign);
    bool Save();
}
