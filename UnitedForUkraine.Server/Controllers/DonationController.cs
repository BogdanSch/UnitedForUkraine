using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationController : ControllerBase
{
    private readonly IDonationRepository _donationRepository;
    private const int PAGE_ITEMS_COUNT = 6;

    public DonationController(IDonationRepository donationRepository)
    {
        _donationRepository = donationRepository;
    }
    [HttpGet("getDonations")]
    public async Task<IActionResult> GetDontaionsData()
    {
        var donations = await _donationRepository.GetDonations(PAGE_ITEMS_COUNT);
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
