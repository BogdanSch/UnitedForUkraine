using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Interfaces;

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
    [HttpGet("getCompaigns")]
    public async Task<IActionResult> GetCampaignsData()
    {
        var campaigns = await _campaignRepository.GetCampaigns(_pageCount);

        return Ok(new { campaigns });
    }
    [HttpGet("getDonations")]
    public async Task<IActionResult> GetDontaionsData()
    {
        var donations = await _donationRepository.GetDonations(_pageCount);

        return Ok(new { donations });
    }
}
