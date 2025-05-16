using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class CampaignRepository : ICampaignRepository
{
    private readonly ApplicationDbContext _context;
    public CampaignRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<Campaign> GetAllCampaigns(QueryObject queryObject)
    {
        var campaigns = _context.Campaigns.AsNoTracking();//;
        if (!string.IsNullOrWhiteSpace(queryObject.SearchedQuery))
        {
            string query = queryObject.SearchedQuery;
            campaigns = campaigns.Where(c => c.Title.Contains(query) || c.Description.Contains(query));
        }
        return campaigns.OrderByDescending(c => c.StartDate);
    }
    public async Task<Campaign?> GetCampaignByIdAsync(int id)
    {
        return await _context.Campaigns.FirstOrDefaultAsync(campaign => campaign.Id == id);
    }
    public async Task<IEnumerable<Campaign>> GetCampaignsAsync(int campaignsAmount)
    {
        return await _context.Campaigns
            .OrderByDescending(c => c.StartDate)
            .Take(campaignsAmount)
            .ToListAsync(); 
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
}
