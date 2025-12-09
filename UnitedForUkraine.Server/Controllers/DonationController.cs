using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/donations")]
public class DonationController(IDonationRepository donationRepository, ICampaignRepository campaignRepository) : ControllerBase
{
    private readonly IDonationRepository _donationRepository = donationRepository;
    private readonly ICampaignRepository _campaignRepository = campaignRepository;
    private const int NUMBER_OF_DONATIONS_PER_PAGE = 8;
    [HttpGet]
    public async Task<IActionResult> GetPaginatedDontaionsData([FromQuery] QueryObject queryObject)
    {
        var paginatedDonations = await _donationRepository.GetPaginatedDonationsAsync(queryObject, NUMBER_OF_DONATIONS_PER_PAGE);

        if (!paginatedDonations.Any()) return Ok(new PaginatedDonationsDto([], false));
        List<DonationDto> donationDtos = [.. paginatedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, paginatedDonations.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDontaionDataById(int id)
    {
        Donation? targetDonation = await _donationRepository.GetByIdAsync(id);

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

        PaginatedList<Donation> paginatedDonations = await _donationRepository.GetPaginatedDonationsByCampaignId(campaignId, page, NUMBER_OF_DONATIONS_PER_PAGE);
        List<DonationDto> donationDtos = [.. paginatedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, paginatedDonations.HasNextPage));
    }
    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetPaginatedUserDonations(Guid userId, [FromQuery] QueryObject queryObject)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest(new { message = "User's ID cannot be empty." });

        PaginatedList<Donation> loadedDonations = await _donationRepository.GetPaginatedDonationsByUserId(userId.ToString(), queryObject, NUMBER_OF_DONATIONS_PER_PAGE);
        List<DonationDto> donationDtos = [.. loadedDonations.Select(d => d.ToDonationDto())];

        return Ok(new PaginatedDonationsDto(donationDtos, loadedDonations.HasNextPage));
    }
    [HttpPost]
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
            return BadRequest(new { message = "We couldn't create the new donation. Try again later" });
        }
    }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> DeleteDonation([FromRoute] int id)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        await _donationRepository.DeleteAsync(id);
        return NoContent();
    }
    [HttpGet("statistics")]
    public async Task<IActionResult> GetFoundationStatistics()
    {
        DateTime currentPeriod = DateTime.UtcNow.AddMonths(-1);
        (decimal, Data.Enums.CurrencyType) mode = await _donationRepository.GetMostFrequentUserDonationAsync();

        FoundationDonationsStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetTotalDonationsCountAsync(),
            CampaignsCount = await _campaignRepository.GetTotalCampaignsCountAsync(),
            TotalDonationsAmount = await _donationRepository.GetTotalDonationsAmountAsync(),
            BiggestDonationAmount = await _donationRepository.GetBiggestDonationAmountAsync(),
            AverageDonationsAmount = await _donationRepository.GetAverageDonationsAmountAsync(),
            SmallestDonationAmount = await _donationRepository.GetSmallestDonationAmountAsync(),
            MostFrequentDonation = new DonationModeDto
            {
                Amount = mode.Item1,
                Currency = (int)mode.Item2
            },
            UniqueDonorsCount = await _donationRepository.GetUniqueDonorsCountAsync(),
            CityWithMostDonations = await _donationRepository.GetCityWithMostDonationsAsync(),
            CountryWithMostDonations = await _donationRepository.GetCountryWithMostDonationsAsync(),
            MostFrequentDonorName = (await _donationRepository.GetMostFrequentDonorInformationAsync()).donorName,
            DonationsGrowthRate = await _donationRepository.GetDonationsGrowthRateAsync(currentPeriod),
        };
        return Ok(statisticsDto);
    }
    [HttpGet("statistics/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetUserStatistics(Guid userId)
    {
        if(userId == Guid.Empty)
            return BadRequest("User Id can't be empty");

        string donorId = userId.ToString();
        string firstDonationDate = (await _donationRepository.GetFirstDonationDateAsync(donorId))?.ToString(DateSettings.DEFAULT_DATE_FORMAT) ?? DateSettings.UNDEFINED_DATE;
        string lastDonatioDate = (await _donationRepository.GetLastDonationDateAsync(donorId))?.ToString(DateSettings.DEFAULT_DATE_FORMAT) ?? DateSettings.UNDEFINED_DATE;

        UserDonationsStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetTotalDonationsCountAsync(donorId),
            TotalDonationsAmount = await _donationRepository.GetTotalDonationsAmountAsync(donorId),
            AverageDonationsAmount = await _donationRepository.GetAverageDonationsAmountAsync(donorId),
            SmallestDonationAmount = await _donationRepository.GetSmallestDonationAmountAsync(donorId),
            BiggestDonationAmount = await _donationRepository.GetBiggestDonationAmountAsync(donorId),
            SupportedCampaignsCount = await _campaignRepository.GetAllUserSupportedCampaignsCount(donorId),
            FirstDonationDate = firstDonationDate,
            LastDonationDate = lastDonatioDate
        };

        return Ok(statisticsDto);
    }
}