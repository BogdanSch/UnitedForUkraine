using ContosoUniversity;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignController : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository;
    private const int ITEMS_PER_QUERY_COUNT = 6;

    public CampaignController(ICampaignRepository campaignRepository)
    {
        _campaignRepository = campaignRepository;
    }

    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaignsData([FromQuery] int page = 1)
    {
        var campaigns = _campaignRepository.GetAllCampaigns();
        PaginatedList<Campaign> paginatedCampaigns = await PaginatedList<Campaign>.CreateAsync(campaigns, page, ITEMS_PER_QUERY_COUNT);

        List<CampaignDto> campainsList = paginatedCampaigns.Select(c => new CampaignDto()
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            GoalAmount = c.GoalAmount,
            RaisedAmount = c.RaisedAmount,
            Status = Enum.GetName(typeof(CampaignStatus), c.Status)!,
            Currency = Enum.GetName(typeof(CurrencyType), c.Currency)!,
            StartDate = c.StartDate.ToString("MM-dd-yyyy HH:mm:ss"),
            EndDate = c.EndDate.ToString("MM-dd-yyyy HH:mm:ss"),
            ImageUrl = c.ImageUrl
        }).ToList();

        return Ok(new CampaignsDto() { Campaigns = campainsList, HasPreviousPage = paginatedCampaigns.HasPreviousPage, HasNextPage = paginatedCampaigns.HasNextPage});
    }
}
