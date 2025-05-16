using ContosoUniversity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Dtos.Donation;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/donations")]
public class DonationController : ControllerBase
{
    private readonly IDonationRepository _donationRepository;
    private const int PAGE_ITEMS_COUNT = 12;

    public DonationController(IDonationRepository donationRepository)
    {
        _donationRepository = donationRepository;
    }
    [HttpGet]
    public async Task<IActionResult> GetDontaionsData()
    {
        var donations = await _donationRepository.GetDonationsAsync(PAGE_ITEMS_COUNT);

        if (!donations.Any()) return Ok(new List<DonationDto>());

        List<DonationDto> response = [.. donations.Select(d => d.ToDonationDto())];

        return Ok(response);
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDontaionDataById(int id)
    {
        Donation? targetDonation = await _donationRepository.GetDonationByIdAsync(id);

        if (targetDonation == null)
            return NotFound();

        DonationDto donationDto = targetDonation.ToDonationDto();
        return Ok(donationDto);
    }
    [HttpGet("campaign/{campaignId:int}")]
    public async Task<IActionResult> GetCampaignDonationsById(int campaignId, [FromQuery] int page = 1)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var donations = _donationRepository.GetAllDonationsByCampaignId(campaignId);

        if (!donations.Any())
        {
            return Ok(new PaginatedDonationsDto());
        }

        PaginatedList<Donation> loadedDonations = await PaginatedList<Donation>.CreateAsync(donations, page, PAGE_ITEMS_COUNT);

        List<DonationDto> donationDtos = [.. loadedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, loadedDonations.HasNextPage));
    }
    [HttpGet("supportedCampaigns/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetUserSupportedCampaigns(Guid userId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest("User ID cannot be empty.");

        var campaigns = await _donationRepository.GetAllUserSupportedCampaigns(userId.ToString());
        if (!campaigns.Any())
        {
            return Ok(new List<CampaignDto>());
        }
        List<CampaignDto> campaignDtos = [.. campaigns.Select(c => c.ToCampaignDto())];
        return Ok(new { Campaigns = campaignDtos });
    }
    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserDonations(Guid userId, [FromQuery] int page = 1)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest("User ID cannot be empty.");

        var donations = _donationRepository.GetAllDonationsByUserId(userId.ToString());

        if (!donations.Any())
        {
            return Ok(new PaginatedDonationsDto());
        }

        PaginatedList<Donation> loadedDonations = await PaginatedList<Donation>.CreateAsync(donations, page, PAGE_ITEMS_COUNT);

        List<DonationDto> donationDtos = [.. loadedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, loadedDonations.HasNextPage));
    }
    [HttpPost("create/")]
    [Authorize]
    public async Task<IActionResult> CreateDonation([FromBody] CreateDonationRequestDto createdDonationDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            Donation newDonation = createdDonationDto.FromCreateDonationDtoToDonation();
            await _donationRepository.AddAsync(newDonation);
            //await _donationRepository.SaveAsync();

            return Ok(new { id = newDonation.Id });
        }
        catch (Exception)
        {
            return BadRequest("Error while creating the donation!");
        }
    }
    [HttpGet("statistics")]
    public async Task<IActionResult> GetTotalDontaionsNumber()
    {
        DonationStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetTotalUserDonationsCountAsync(null),
            TotalDonationsAmount = await _donationRepository.GetTotalUserDonationsAmountAsync(null),
            AverageDonationsAmount = await _donationRepository.GetAverageUserDonationsAmountAsync(null),
            UniqueDonorsCount = await _donationRepository.GetUniqueDonorsCountAsync()
        };

        return Ok(statisticsDto);
    }
    [HttpGet("statistics/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetUserDonationsStatistics(Guid userId)
    {
        if(userId == Guid.Empty)
            return BadRequest("User ID cannot be empty.");

        UserDonationsStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetTotalUserDonationsCountAsync(userId.ToString()),
            TotalDonationsAmount = await _donationRepository.GetTotalUserDonationsAmountAsync(userId.ToString()),
            AverageDonationsAmount = await _donationRepository.GetAverageUserDonationsAmountAsync(userId.ToString()),
            SupportedCampaignsCount = await _donationRepository.GetAllUserSupportedCampaignsCount(userId.ToString())
        };

        return Ok(statisticsDto);
    }
}