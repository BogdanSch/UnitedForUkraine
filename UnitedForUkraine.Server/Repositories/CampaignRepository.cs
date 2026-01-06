using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Repositories;

public class CampaignRepository(ApplicationDbContext context, ILogger<CampaignRepository> logger) : ICampaignRepository
{
    private readonly ILogger<CampaignRepository> _logger = logger;
    private readonly ApplicationDbContext _context = context;
    private async Task<HashSet<int>> GetUserLikedCampaignsAsync(string userId)
    {
        return await _context.CampaignLikes.Where(cl => cl.UserId == userId).Select(cl => cl.LikedCampaignId).ToHashSetAsync();
    }
    public async Task<PaginatedList<CampaignDto>> GetPaginatedCampaigns(QueryObject queryObject, int pageSize, bool showOnlyLiked = false, string? userId = null)
    {
        IQueryable<Campaign> campaigns = _context.Campaigns.AsNoTracking();

        HashSet<int> likedCampaignIds = [];
        if (!string.IsNullOrWhiteSpace(userId))
        {
            likedCampaignIds = await GetUserLikedCampaignsAsync(userId);
        }

        if (showOnlyLiked && !string.IsNullOrWhiteSpace(userId))
        {
            campaigns = campaigns.Where(c => likedCampaignIds.Contains(c.Id));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.SearchedQuery))
        {
            string query = queryObject.SearchedQuery;
            string pattern = $"%{query}%";
            campaigns = campaigns.Where(c => 
                    EF.Functions.Like(c.Title, pattern) ||
                    EF.Functions.Like(c.Description, pattern) ||
                    EF.Functions.Like(c.Slogan, pattern)
                );
        }
        if (!string.IsNullOrWhiteSpace(queryObject.Categories))
        {
            string[] categoryList = queryObject.Categories.Split('+', StringSplitOptions.RemoveEmptyEntries);
            HashSet<CampaignCategory> parsedCategories = [];
            foreach (var c in categoryList)
            {
                if (Enum.TryParse<CampaignCategory>(c.Trim(), out CampaignCategory result) && result != CampaignCategory.None)
                    parsedCategories.Add(result);
            }
            if (parsedCategories.Count != 0)
                campaigns = campaigns.Where(c => parsedCategories.Contains(c.Category));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.Statuses))
        {
            string[] statusList = queryObject.Statuses.Split('+', StringSplitOptions.RemoveEmptyEntries);
            HashSet<CampaignStatus> parsedStatuses = [];

            foreach (var s in statusList)
            {
                if (Enum.TryParse<CampaignStatus>(s.Trim(), out CampaignStatus result))
                    parsedStatuses.Add(result);
            }
            if (parsedStatuses.Count != 0)
                campaigns = campaigns.Where(c => parsedStatuses.Contains(c.Status));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.Currencies))
        {
            string[] currencyList = queryObject.Currencies.Split('+', StringSplitOptions.RemoveEmptyEntries);
            HashSet<CurrencyType> parsedCurrencies = [];

            foreach (var cur in currencyList)
            {
                if (Enum.TryParse<CurrencyType>(cur.Trim(), out CurrencyType result))
                    parsedCurrencies.Add(result);
            }

            if (parsedCurrencies.Count != 0)
                campaigns = campaigns.Where(c => parsedCurrencies.Contains(c.Currency));
        }
        if (!string.IsNullOrWhiteSpace(queryObject.SortOrder))
        {
            campaigns = queryObject.SortOrder switch
            {
                "title_asc" => campaigns.OrderBy(c => c.Title),
                "date_dsc" => campaigns.OrderByDescending(c => c.StartDate),
                "nearGoal_dsc" => campaigns.OrderByDescending(c => c.GoalAmount <= 0m ? 0m : c.RaisedAmount / c.GoalAmount),
                "nearEnd_asc" => campaigns.OrderBy(c => c.EndDate),
                _ => campaigns.OrderByDescending(c => c.StartDate),
            };
        }
        else
        {
            campaigns = campaigns.OrderByDescending(c => c.StartDate);
        }

        return await PaginatedList<CampaignDto>.CreateAsync(campaigns.Select(c => c.ToCampaignDto(likedCampaignIds.Contains(c.Id))), queryObject.Page, pageSize);
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
        Campaign? campaign = await _context.Campaigns.FindAsync(id) ?? throw new Exception("Campaign not found");

        _context.Campaigns.Remove(campaign);
        await SaveAsync();
        
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
    public async Task<int> GetTotalCreatedCampaignsCountAsync(DateTime? start = null, DateTime? end = null)
    {
        IQueryable<Campaign> campaigns = _context.Campaigns.AsQueryable();
        if (start is not null && end is not null) 
            campaigns = campaigns.Where(c => c.StartDate >= start || c.EndDate <= end);
        return await campaigns.CountAsync(); 
    }
    private IQueryable<Campaign> GetAllUserSupportedCampaigns(string userId)
    {
        return _context.Donations.Where(d => d.UserId == userId)
            .Select(d => d.Campaign)
            .Distinct();
    }
    public async Task<PaginatedList<CampaignDto>> GetPaginatedUserSupportedCampaignsAsync(QueryObject queryObject, int pageSize, string userId)
    {
        IQueryable<Campaign> campaigns = GetAllUserSupportedCampaigns(userId);
        HashSet<int> likedCampaignIds = await GetUserLikedCampaignsAsync(userId);

        return await PaginatedList<CampaignDto>.CreateAsync(campaigns.Select(c => c.ToCampaignDto(likedCampaignIds.Contains(c.Id))), queryObject.Page, pageSize);
    }
    public async Task<int> GetAllUserSupportedCampaignsCount(string? userId)
    {
        if (string.IsNullOrWhiteSpace(userId)) return 0;
        return await GetAllUserSupportedCampaigns(userId).CountAsync();
    }
    private async Task<CampaignLike?> GetCampaignLikeForUser(int campaignId, string userId)
    {
        return await _context.CampaignLikes.FirstOrDefaultAsync(cl => cl.UserId == userId && cl.LikedCampaignId == campaignId);
    }
    public async Task<bool> IsCampaignLikedByUser(int campaignId, string userId)
    {
        CampaignLike? campaignLike = await GetCampaignLikeForUser(campaignId, userId);
        return campaignLike is not null;
    }
    public async Task<bool> LikeOrDislikeCampaignAsync(int campaignId, string userId)
    {
        CampaignLike? campaignLike = await GetCampaignLikeForUser(campaignId, userId);
        bool isNowLiked = false;

        if (campaignLike is null)
        {
            await _context.CampaignLikes.AddAsync(new()
            {
                LikedCampaignId = campaignId,
                UserId = userId
            });
            isNowLiked = true;
        }
        else
        {
            _context.CampaignLikes.Remove(campaignLike);
        }

        await SaveAsync();
        return isNowLiked;
    }
}
