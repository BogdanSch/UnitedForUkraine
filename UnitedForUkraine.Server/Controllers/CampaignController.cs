using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignController : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository;
    private const int PAGE_ITEMS_COUNT = 6;
    public CampaignController(ICampaignRepository campaignRepository)
    {
        _campaignRepository = campaignRepository;
    }
    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaignsData()
    {
        var campaigns = await _campaignRepository.GetCampaigns(PAGE_ITEMS_COUNT);
        var response = campaigns.Select(c => new
        {
            c.Id,
            c.Title,
            c.Description,
            c.GoalAmount,
            c.RaisedAmount,
            Status = Enum.GetName(typeof(CampaignStatus), c.Status),
            Currency = Enum.GetName(typeof(CurrencyType), c.Currency),
            c.StartDate,
            c.EndDate,
            c.ImageUrl
        }).ToList();

        return Ok(response);
    }
}
