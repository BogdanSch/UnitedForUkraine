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
            IQueryable<NewsUpdate> newsUpdates = _context.NewsUpdates.Include(n => n.User).AsNoTracking();

            if (!string.IsNullOrWhiteSpace(queryObject.SearchedQuery))
            {
                string query = queryObject.SearchedQuery;
                newsUpdates = newsUpdates.Where(n => n.Title.Contains(query, StringComparison.OrdinalIgnoreCase) || n.Content.Contains(query, StringComparison.OrdinalIgnoreCase));
            }
            if(!string.IsNullOrWhiteSpace(queryObject.SortOrder))
            {
                newsUpdates = queryObject.SortOrder switch
                {
                    "title_asc" => newsUpdates.OrderBy(c => c.Title),
                    "date_asc" => newsUpdates.OrderBy(c => c.PostedAt),
                    "readingTime_asc" => newsUpdates.OrderBy(c => c.ReadingTimeInMinutes),
                    "readingTime_dsc" => newsUpdates.OrderByDescending(c => c.ReadingTimeInMinutes),
                    _ => newsUpdates.OrderByDescending(n => n.PostedAt)
                };
            }
            else
            {
                newsUpdates = newsUpdates.OrderByDescending(n => n.PostedAt);
            }
            
            return await PaginatedList<NewsUpdate>.CreateAsync(newsUpdates, queryObject.Page, itemsPerPageCount);
        }
        public async Task<NewsUpdate?> GetByIdAsync(int id) => await _context.NewsUpdates.FirstOrDefaultAsync(n => n.Id == id);
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
    }
}
