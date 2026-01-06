using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories
{
    public class NewsUpdateRepository(ApplicationDbContext context) : INewsUpdateRepository
    {
        private readonly ApplicationDbContext _context = context;
        public async Task<PaginatedList<NewsUpdate>> GetPaginatedAsync(QueryObject queryObject, int itemsPerPageCount)
        {
            IQueryable<NewsUpdate> newsUpdates = _context.NewsUpdates.Include(n => n.Author).Include(n => n.TargetCampaign).AsNoTracking();

            if (!string.IsNullOrWhiteSpace(queryObject.SearchedQuery))
            {
                string query = queryObject.SearchedQuery;
                string pattern = $"%{query}%";
                newsUpdates = newsUpdates.Where(n =>
                    EF.Functions.Like(n.Title, pattern) ||
                    EF.Functions.Like(n.Content, pattern) ||
                    EF.Functions.Like(n.KeyWords, pattern)
                );
            }
            if(!string.IsNullOrWhiteSpace(queryObject.SortOrder))
            {
                newsUpdates = queryObject.SortOrder switch
                {
                    "title_asc" => newsUpdates.OrderBy(c => c.Title),
                    "date_asc" => newsUpdates.OrderBy(c => c.PostedAt),
                    "readingTime_asc" => newsUpdates.OrderBy(c => c.ReadingTimeInMinutes),
                    "readingTime_dsc" => newsUpdates.OrderByDescending(c => c.ReadingTimeInMinutes),
                    "viewsCount_dsc" => newsUpdates.OrderByDescending(c => c.ViewsCount),
                    _ => newsUpdates.OrderByDescending(n => n.PostedAt)
                };
            }
            else
            {
                newsUpdates = newsUpdates.OrderByDescending(n => n.PostedAt);
            }
            if(!string.IsNullOrWhiteSpace(queryObject.CampaignIds))
            {
                string[] campaignIds = queryObject.CampaignIds.Split('+', StringSplitOptions.RemoveEmptyEntries);
                if (campaignIds.Length != 0)
                    newsUpdates = newsUpdates.Where(n => campaignIds.Contains(n.CampaignId.ToString()));
            }
            
            return await PaginatedList<NewsUpdate>.CreateAsync(newsUpdates, queryObject.Page, itemsPerPageCount);
        }
        public async Task<NewsUpdate?> GetByIdAsync(int id) => await _context.NewsUpdates.Include(n => n.Author).Include(n => n.TargetCampaign).FirstOrDefaultAsync(n => n.Id == id);
        public async Task AddAsync(NewsUpdate newsUpdate)
        {
            await _context.NewsUpdates.AddAsync(newsUpdate);
            await SaveAsync();
        }
        public async Task<bool> DeleteByIdAsync(int id)
        {
            NewsUpdate? newsUpdate = await GetByIdAsync(id);

            if (newsUpdate is null)
                return false;

            _context.NewsUpdates.Remove(newsUpdate);
            return await SaveAsync();
        }
        public async Task<bool> UpdateAsync(NewsUpdate newsUpdate)
        {
            _context.NewsUpdates.Update(newsUpdate);
            return await SaveAsync();
        }
        public async Task<bool> SaveAsync()
        {
            int saved = await _context.SaveChangesAsync();
            return saved > 0;
        }
        private IQueryable<NewsUpdate> GetNewsUpdatesQuery(int? campaignId = null, DateTime? startDate = null, DateTime? endDate = null)
        {
            IQueryable<NewsUpdate> newsUpdates = _context.NewsUpdates.AsQueryable();
            if(campaignId is not null)
            {
                newsUpdates = newsUpdates.Where(n => n.CampaignId == campaignId);
            }
            if(startDate is not null && endDate is not null)
            {
                newsUpdates = newsUpdates.Where(n => n.PostedAt >= startDate && n.PostedAt <= endDate);
            }
            return newsUpdates;
        }
        public async Task<int> GetNewsUpdatesCountByCampaignIdAsync(int campaignId)
        {
            return await GetNewsUpdatesQuery(campaignId).CountAsync();
        }
        public async Task<int> GetNewsUpdatesCount(DateTime? start = null, DateTime? end = null)
        {
            return await GetNewsUpdatesQuery(startDate: start, endDate: end).CountAsync();
        }
    }
}
