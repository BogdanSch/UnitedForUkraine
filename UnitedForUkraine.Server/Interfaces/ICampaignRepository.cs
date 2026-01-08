using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface ICampaignRepository
{
    Task<PaginatedList<CampaignDto>> GetPaginatedCampaigns(QueryObject queryObject, int pageSize, bool showOnlyLiked = false, string? userId = null);
    Task<bool> UpdateExpiredCampaignsAsync();
    Task<bool> UpdateJustStartedCampaignsAsync();
    Task<Campaign?> GetByIdAsync(int id);
    Task AddAsync(Campaign campaign);
    Task<Campaign> DeleteAsync(int id);
    Task<bool> UpdateAsync(Campaign campaign);
    Task<bool> SaveAsync();
    Task<int> GetCampaignsCountAsync(DateTime? start = null, DateTime? end = null);
    Task<PaginatedList<CampaignDto>> GetPaginatedUserSupportedCampaignsAsync(QueryObject queryObject, int pageSize, string userId);
    Task<int> GetAllUserSupportedCampaignsCount(string? userId);
    Task<bool> IsCampaignLikedByUser(int campaignId, string userId);
    Task<bool> LikeOrDislikeCampaignAsync(int campaignId, string userId);
}
