using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface INewsUpdateRepository
{
    Task<PaginatedList<NewsUpdate>> GetPaginatedAsync(QueryObject queryObject, int itemsPerPageCount); 
    Task<NewsUpdate?> GetByIdAsync(int id);
    Task AddAsync(NewsUpdate newsUpdate);
    Task<bool> DeleteByIdAsync(int id);
    Task<bool> UpdateAsync(NewsUpdate newsUpdate);
    Task<bool> SaveAsync();
    Task<int> GetNewsUpdatesCountByCampaignIdAsync(int campaignId);
}

