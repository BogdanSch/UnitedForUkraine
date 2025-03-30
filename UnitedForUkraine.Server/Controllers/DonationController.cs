using ContosoUniversity;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

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

        List<DonationDto> response = donations.Select(d => d.ToDonationDto()).ToList();

        return Ok(response);
    }
    [HttpGet("donations/campaign/{campaignId}")]
    public async Task<IActionResult> GetCampaignDonationById(int campaignId, [FromQuery] int page = 1)
    {
        var donations = _donationRepository.GetAllDonationsByCampaignId(campaignId);

        if (!donations.Any())
        {
            return Ok(new PaginatedDonationsDto());
        }

        PaginatedList<Donation> loadedDonations = await PaginatedList<Donation>.CreateAsync(donations, page, PAGE_ITEMS_COUNT);

        List<DonationDto> donationDtos = loadedDonations.Select(d => d.ToDonationDto()).ToList();

        return Ok(new PaginatedDonationsDto(donationDtos, loadedDonations.HasNextPage));
    }
    [HttpGet("donations/{id}")]
    public async Task<IActionResult> GetDontaionDataById(int id)
    {
        Donation targetDonation = await _donationRepository.GetDonationById(id);

        if (targetDonation == null) 
            return NotFound();

        DonationDto donationDto = targetDonation.ToDonationDto();
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
