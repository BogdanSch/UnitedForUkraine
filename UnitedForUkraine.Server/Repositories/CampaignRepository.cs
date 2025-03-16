using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
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

    public IQueryable<Campaign> GetAllCampaigns()
    {
        return _context.Campaigns.AsNoTracking().OrderByDescending(c => c.StartDate);
    }
    public async Task<Campaign> GetCampaignById(int id)
    {
        return await _context.Campaigns.FirstOrDefaultAsync(campaign => campaign.Id == id);
    }
    public async Task<IEnumerable<Campaign>> GetCampaigns(int campaignsAmount)
    {
        return await _context.Campaigns
            .OrderByDescending(c => c.StartDate)
            .Take(campaignsAmount)
            .ToListAsync(); 
    }
    public async Task<Campaign> Add(Campaign campaign)
    {
        await _context.Campaigns.AddAsync(campaign);
        Save();
        return campaign;
    }
    public async Task<Campaign> Delete(int id)
    {
        Campaign? campaign = await _context.Campaigns.FindAsync(id);

        if (campaign != null)
        {
            _context.Campaigns.Remove(campaign);
            Save();
        }
        else
        {
            throw new Exception("Campaign not found");
        }

        return campaign;
    }
    public bool Update(Campaign campaign)
    {
        _context.Campaigns.Update(campaign);
        return Save();
    }
    public bool Save()
    {
        int saved = _context.SaveChanges();
        return saved > 0;
    }
}
