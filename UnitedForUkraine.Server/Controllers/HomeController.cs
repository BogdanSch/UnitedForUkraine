using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly IDonationRepository _donationRepository;
    private readonly ICampaignRepository _campaignRepository;
    private readonly int _pageCount = 6;
    public HomeController(IDonationRepository donationRepository, ICampaignRepository campaignRepository)
    {
        _donationRepository = donationRepository;
        _campaignRepository = campaignRepository;
    }
    [HttpGet("getCampaigns")]
    public async Task<IActionResult> GetCampaignsData()
    {
        var campaigns = await _campaignRepository.GetCampaigns(_pageCount);
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
    [HttpGet("getDonations")]
    public async Task<IActionResult> GetDontaionsData()
    {
        var donations = await _donationRepository.GetDonations(_pageCount);
        var response = donations.Select(d => new
        {
            d.Id,
            d.UserId,
            d.Amount,
            Currency = Enum.GetName(typeof(CurrencyType), d.Currency),
            PaymentMethod = Enum.GetName(typeof(PaymentMethod), d.PaymentMethod),
            Status = Enum.GetName(typeof(DonationStatus), d.Status),
            d.PaymentDate,
            d.CampaignId
        }).ToList();

        return Ok(response);
    }
}
