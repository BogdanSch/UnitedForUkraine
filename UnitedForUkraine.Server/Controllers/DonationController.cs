using ContosoUniversity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Dtos.Donation;
using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/donations")]
public class DonationController : ControllerBase
{
    private readonly IDonationRepository _donationRepository;
    private readonly ICampaignRepository _campaignRepository;
    private const int NUMBER_OF_DONATIONs_PER_PAGE = 12;
    public DonationController(IDonationRepository donationRepository, ICampaignRepository campaignRepository)
    {
        _donationRepository = donationRepository;
        _campaignRepository = campaignRepository;
    }
    [HttpGet]
    public async Task<IActionResult> GetPaginatedDontaionsData([FromQuery] QueryObject queryObject)
    {
        var paginatedDonations = await _donationRepository.GetPaginatedDonationsAsync(queryObject, NUMBER_OF_DONATIONs_PER_PAGE);

        if (!paginatedDonations.Any()) return Ok(new List<DonationDto>());
        List<DonationDto> donationDtos = [.. paginatedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, paginatedDonations.HasNextPage));
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
    public async Task<IActionResult> GetCampaignDonations(int campaignId, [FromQuery] int page = 1)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        PaginatedList<Donation> paginatedDonations = await _donationRepository.GetPaginatedDonationsByCampaignId(campaignId, page, NUMBER_OF_DONATIONs_PER_PAGE);
        List<DonationDto> donationDtos = [.. paginatedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, paginatedDonations.HasNextPage));
    }
    [HttpGet("user/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetPaginatedUserDonations(Guid userId, [FromQuery] QueryObject queryObject)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest(new { message = "User's ID cannot be empty." });

        PaginatedList<Donation> loadedDonations = await _donationRepository.GetPaginatedDonationsByUserId(userId.ToString(), queryObject, NUMBER_OF_DONATIONs_PER_PAGE);
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

            return Ok(new { id = newDonation.Id });
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
    [HttpGet("statistics")]
    public async Task<IActionResult> GetFoundationStatistics()
    {
        FoundationDonationsStatisticsDto statisticsDto = new()
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
    public async Task<IActionResult> GetUserStatistics(Guid userId)
    {
        if(userId == Guid.Empty)
            return BadRequest("User ID cannot be empty.");

        UserDonationsStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetTotalUserDonationsCountAsync(userId.ToString()),
            TotalDonationsAmount = await _donationRepository.GetTotalUserDonationsAmountAsync(userId.ToString()),
            AverageDonationsAmount = await _donationRepository.GetAverageUserDonationsAmountAsync(userId.ToString()),
            SupportedCampaignsCount = await _campaignRepository.GetAllUserSupportedCampaignsCount(userId.ToString())
        };

        return Ok(statisticsDto);
    }
}