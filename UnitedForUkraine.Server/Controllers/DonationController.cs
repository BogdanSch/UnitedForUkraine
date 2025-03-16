using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Donation;
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
    [HttpGet("donations")]
    public async Task<IActionResult> GetDontaionsData()
    {
        var donations = await _donationRepository.GetDonations(PAGE_ITEMS_COUNT);

        if (!donations.Any()) return Ok(new List<DonationDto>());

        List<DonationDto> response = donations.Select(d => new DonationDto
        {
            Id = d.Id,
            UserId = d.UserId,
            Amount = d.Amount,
            Currency = Enum.GetName(typeof(CurrencyType), d.Currency)!,
            PaymentMethod = Enum.GetName(typeof(PaymentMethod), d.PaymentMethod)!,
            Status = Enum.GetName(typeof(DonationStatus), d.Status)!,
            PaymentDate = d.PaymentDate.ToString("MM-dd-yyyy HH:mm:ss"),
            CampaignId = d.CampaignId
        }).ToList();

        return Ok(response);
    }
    [HttpGet("statistics")]
    public async Task<IActionResult> GetTotalDontaionsNumber()
    {
        DonationStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetTotalDonationsCount(),
            TotalDonationsAmount = _donationRepository.GetTotalDonationsAmount(),
            AverageDonationsAmount = await _donationRepository.GetAverageDonationsAmount(),
            UniqueDonorsCount = await _donationRepository.GetUniqueDonorsCount()
        };

        return Ok(statisticsDto);
    }
}
