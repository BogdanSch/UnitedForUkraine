using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class CampaignRepository(ApplicationDbContext context) : ICampaignRepository
{
    private readonly ApplicationDbContext _context = context;
    public async Task<PaginatedList<Campaign>> GetPaginatedCampaigns(QueryObject queryObject, int itemsPerPageCount)
    {
        var campaigns = _context.Campaigns.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(queryObject.SearchedQuery))
        {
            string query = queryObject.SearchedQuery;
            campaigns = campaigns.Where(c => c.Title.Contains(query, StringComparison.OrdinalIgnoreCase) || c.Description.Contains(query, StringComparison.OrdinalIgnoreCase));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.SortOrder))
        {
            campaigns = queryObject.SortOrder switch
            {
                "title_asc" => campaigns.OrderBy(c => c.Title),
                "date_dsc" => campaigns.OrderByDescending(c => c.StartDate),
                "mostFunded_dsc" => campaigns.OrderByDescending(c => c.RaisedAmount),
                "nearGoal_dsc" => campaigns.OrderByDescending(c => c.RaisedAmount / c.GoalAmount),
                "nearEnd_dsc" => campaigns.OrderByDescending(c => c.EndDate),
                _ => campaigns.OrderByDescending(c => c.StartDate),
            };
        }
        else
        {
            campaigns = campaigns.OrderByDescending(c => c.StartDate);
        }

        CampaignCategory category = (CampaignCategory)queryObject.FilterCategory;
        if(category != CampaignCategory.None)
        {
            campaigns = campaigns.Where(c => c.Category == category);
        }

        return await PaginatedList<Campaign>.CreateAsync(campaigns, queryObject.Page, itemsPerPageCount);
    }
    public async Task<Campaign?> GetCampaignByIdAsync(int id)
    {
        return await _context.Campaigns.FirstOrDefaultAsync(campaign => campaign.Id == id);
    }
    public async Task AddAsync(Campaign campaign)
    {
        await _context.Campaigns.AddAsync(campaign);
        await SaveAsync();
    }
    public async Task<Campaign> DeleteAsync(int id)
    {
        Campaign? campaign = await _context.Campaigns.FindAsync(id);

        if (campaign != null)
        {
            _context.Campaigns.Remove(campaign);
            await SaveAsync();
        }
        else
        {
            throw new Exception("Campaign not found");
        }

        return campaign;
    }
    public async Task<bool> UpdateAsync(Campaign campaign)
    {
        _context.Campaigns.Update(campaign);
        return await SaveAsync();
    }
    public async Task<bool> SaveAsync()
    {
        int saved = await _context.SaveChangesAsync();
        return saved > 0;
    }
    public IQueryable<Campaign> GetAllUserSupportedCampaigns(string? userId)
    {
        return _context.Donations.Where(d => d.UserId == userId)
            .Select(d => d.Campaign)
            .Distinct();
    }
    public async Task<int> GetAllUserSupportedCampaignsCount(string? userId)
    {
        return await GetAllUserSupportedCampaigns(userId).CountAsync();
    }
}
