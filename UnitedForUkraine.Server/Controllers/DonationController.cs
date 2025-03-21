using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Repositories;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonationController : ControllerBase
{
    private readonly IDonationRepository _donationRepository;
    private const int PAGE_ITEMS_COUNT = 12;

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
            UserName = d.User.UserName,
            Amount = d.Amount,
            Currency = Enum.GetName(d.Currency)!,
            PaymentMethod = Enum.GetName(d.PaymentMethod)!,
            Status = Enum.GetName(d.Status)!,
            PaymentDate = d.PaymentDate.ToString("MM-dd-yyyy HH:mm:ss"),
            CampaignId = d.CampaignId
        }).ToList();

        return Ok(response);
    }
    [HttpGet("donations/campaign/{campaignId}")]
    public async Task<IActionResult> GetCampaignDonationById(int campaignId, [FromQuery] int page = 1)
    {
        var donations = await _donationRepository.GetAllDonationsByCampaignId(campaignId);

        if (!donations.Any())
        {
            return Ok(new LoadedDonationsDto());
        }

        List<DonationDto> donationDtos = donations.Select(d => new DonationDto()
        {
            Id = d.Id,
            UserId = d.UserId,
            UserName = d.User.UserName,
            Amount = d.Amount,
            Currency = Enum.GetName(typeof(CurrencyType), d.Currency)!,
            PaymentMethod = Enum.GetName(typeof(PaymentMethod), d.PaymentMethod)!,
            Status = Enum.GetName(typeof(DonationStatus), d.Status)!,
            PaymentDate = d.PaymentDate.ToString("MM-dd-yyyy HH:mm:ss"),
            CampaignId = d.CampaignId
        }).Skip((page - 1) * PAGE_ITEMS_COUNT).Take(PAGE_ITEMS_COUNT).ToList();

        return Ok(new LoadedDonationsDto() { Donations = donationDtos, HasNextPage = true });
    }
    [HttpGet("donations/{id}")]
    public async Task<IActionResult> GetDontaionDataById(int id)
    {
        Donation targetDonation = await _donationRepository.GetDonationById(id);

        if (targetDonation == null) 
            return NotFound();

        DonationDto donationDto = new()
        {
            Id = targetDonation.Id,
            UserId = targetDonation.UserId,
            UserName = targetDonation.User.UserName!,
            Amount = targetDonation.Amount,
            Currency = Enum.GetName(typeof(CurrencyType), targetDonation.Currency)!,
            PaymentMethod = Enum.GetName(typeof(PaymentMethod), targetDonation.PaymentMethod)!,
            Status = Enum.GetName(typeof(DonationStatus), targetDonation.Status)!,
            PaymentDate = targetDonation.PaymentDate.ToString("MM-dd-yyyy HH:mm:ss"),
            CampaignId = targetDonation.CampaignId
        };

        return Ok(donationDto);
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
