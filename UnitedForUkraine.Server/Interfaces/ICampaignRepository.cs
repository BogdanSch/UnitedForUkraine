using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface ICampaignRepository
{
    Task<IEnumerable<Campaign>> GetAllCampaigns();
    Task<IEnumerable<Campaign>> GetCampaigns(int campaignsAmount);
    Task<Campaign> GetCampaignById(int id);
    Task<Campaign> Add(Campaign campaign);
    Task<Campaign> Delete(int id);
    Task<bool> Update(Campaign campaign);
    Task<bool> Save();
}
