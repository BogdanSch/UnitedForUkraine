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

    public async Task<IEnumerable<Campaign>> GetAllCampaigns()
    {
        return await _context.Campaigns.OrderByDescending(c => c.StartDate).ToListAsync();
    }
    public async Task<Campaign> GetCampaignById(int id)
    {
        return await _context.Campaigns.FirstOrDefaultAsync(campaign => campaign.Id == id);
    }
    public async Task<IEnumerable<Campaign>> GetCampaigns(int donationsAmount)
    {
        return await _context.Campaigns
            .OrderByDescending(c => c.StartDate)
            .Take(donationsAmount)
            .ToListAsync();
    }
    public async Task<Campaign> Add(Campaign campaign)
    {
        await _context.Campaigns.AddAsync(campaign);
        await Save();
        return campaign;
    }
    public async Task<Campaign> Delete(int id)
    {
        Campaign? camaign = await _context.Campaigns.FindAsync(id);

        if (camaign != null)
        {
            _context.Campaigns.Remove(camaign);
            await Save();
        }

        return camaign;
    }
    public async Task<bool> Update(Campaign campaign)
    {
        _context.Campaigns.Update(campaign);
        return await Save();
    }
    public async Task<bool> Save()
    {
        int saved = _context.SaveChanges();
        return saved > 0;
    }
}
