﻿using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace UnitedForUkraine.Server.Repositories;

public class CampaignRepository(ApplicationDbContext context, ILogger<CampaignRepository> logger) : ICampaignRepository
{
    private readonly ILogger<CampaignRepository> _logger = logger;
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
                "nearGoal_dsc" => campaigns.OrderByDescending(c => c.GoalAmount <= 0m ? 0m : c.RaisedAmount / c.GoalAmount),
                "nearEnd_dsc" => campaigns.OrderByDescending(c => c.EndDate),
                _ => campaigns.OrderByDescending(c => c.StartDate),
            };
        }
        else
        {
            campaigns = campaigns.OrderByDescending(c => c.StartDate);
        }

        if (!string.IsNullOrWhiteSpace(queryObject.FilterName) && !string.IsNullOrWhiteSpace(queryObject.FilterCategories))
        {
            string[] categories = [.. queryObject.FilterCategories.Split('+', StringSplitOptions.RemoveEmptyEntries).Select(c => c.Trim()).ToArray()];

            switch (queryObject.FilterName)
            {
                case "campaignCategory":
                    CampaignCategory[] requiredCategories = [.. categories.Select(c =>
                    {
                        if (Enum.TryParse<CampaignCategory>(c, out CampaignCategory campaignCategory))
                            return campaignCategory;
                        return CampaignCategory.None;
                    })];

                    if (!requiredCategories.Contains(CampaignCategory.None))
                        campaigns = campaigns.Where(c => requiredCategories.Contains(c.Category));
                    break;
                case "campaignStatus":
                    CampaignStatus[] requiredStatuses = [.. categories.Select(c =>
                    {
                        if (Enum.TryParse<CampaignStatus>(c, out CampaignStatus campaignStatus))
                            return campaignStatus;
                        return CampaignStatus.Upcoming;
                    })];

                    campaigns = campaigns.Where(c => requiredStatuses.Contains(c.Status));
                    break;
            }
        }

        return await PaginatedList<Campaign>.CreateAsync(campaigns, queryObject.Page, itemsPerPageCount);
    }
    public async Task<bool> UpdateExpiredCampaignsAsync()
    {
        DateTime currentDate = DateTime.Now;
        List<Campaign> unmarkedFinishedCampaigns = await _context.Campaigns.Where(c => c.EndDate <= currentDate && c.Status == CampaignStatus.Ongoing).ToListAsync();

        try
        {
            foreach (Campaign campaign in unmarkedFinishedCampaigns)
            {
                campaign.Status = CampaignStatus.Completed;
                await UpdateAsync(campaign);
            }
        }
        catch (Exception e)
        {
            _logger.LogError($"An error has occured when updating the expired campaigns: ${e.Message}");
            return false;
        }

        return true;
    }
    public async Task<bool> UpdateJustStartedCampaignsAsync()
    {
        DateTime currentDate = DateTime.Now;
        List<Campaign> unmarkedStartedCampaigns = await _context.Campaigns.Where(c => c.StartDate <= currentDate && c.Status == CampaignStatus.Upcoming).ToListAsync();

        try
        {
            foreach (Campaign campaign in unmarkedStartedCampaigns)
            {
                campaign.Status = CampaignStatus.Ongoing;
                await UpdateAsync(campaign);
            }
        }
        catch (Exception e)
        {
            _logger.LogError($"An error has occured when updating the just started campaigns: ${e.Message}");
            return false;
        }

        return true;
    }
    public async Task<Campaign?> GetByIdAsync(int id)
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
    private IQueryable<Campaign> GetAllUserSupportedCampaigns(string userId)
    {
        return _context.Donations.Where(d => d.UserId == userId)
            .Select(d => d.Campaign)
            .Distinct();
    }
    public async Task<List<CampaignDto>> GetAllUserSupportedCampaignsAsync(string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return [];
        return await GetAllUserSupportedCampaigns(userId).Select(c => c.ToCampaignDto()).ToListAsync();
    }
    public async Task<int> GetAllUserSupportedCampaignsCount(string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return 0;
        return await GetAllUserSupportedCampaigns(userId).CountAsync();
    }
}
