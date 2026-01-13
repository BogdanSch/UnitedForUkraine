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
public class DonationController(IDonationRepository donationRepository, ICampaignRepository campaignRepository, ICurrencyConverterService currencyConverterService) : ControllerBase
{
    private readonly IDonationRepository _donationRepository = donationRepository;
    private readonly ICampaignRepository _campaignRepository = campaignRepository;
    private readonly ICurrencyConverterService _currencyConverterService = currencyConverterService;
    private const int NUMBER_OF_DONATIONS_PER_PAGE = 8;
    [HttpGet]
    public async Task<IActionResult> GetPaginatedDonationsData([FromQuery] int? campaignId, [FromQuery] Guid? userId, [FromQuery] QueryObject queryObject)
    {
        PaginatedList<Donation> paginatedDonations;

        if(campaignId.HasValue)
        {
            paginatedDonations = await _donationRepository.GetPaginatedCampaignDonationsAsync(campaignId.Value, queryObject, NUMBER_OF_DONATIONS_PER_PAGE);
        }
        else if(userId.HasValue)
        {
            if (userId == Guid.Empty)
                return BadRequest(new { message = "User's identifier cannot be empty." });
            paginatedDonations = await _donationRepository.GetPaginatedUserDonationsAsync(userId.Value.ToString(), queryObject, NUMBER_OF_DONATIONS_PER_PAGE);
        }
        else
        {
            paginatedDonations = await _donationRepository.GetPaginatedDonationsAsync(queryObject, NUMBER_OF_DONATIONS_PER_PAGE);
        }

        List<DonationDto> donationDtos = [.. paginatedDonations.Select(d => d.ToDonationDto())];
        return Ok(new PaginatedDonationsDto(donationDtos, paginatedDonations.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDontaionDataById(int id)
    {
        Donation? targetDonation = await _donationRepository.GetByIdAsync(id);

        if (targetDonation is null)
            return NotFound();

        DonationDto donationDto = targetDonation.ToDonationDto();
        return Ok(donationDto);
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
            newDonation.AmountInUah = await _currencyConverterService.ConvertToUahAsync(newDonation.Amount, newDonation.Currency);
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
            DonationsCount = await _donationRepository.GetDonationsCountAsync(),
            CampaignsCount = await _campaignRepository.GetCampaignsCountAsync(),
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
        string firstDonationDate = (await _donationRepository.GetFirstDonationDateAsync(donorId))?.ToString(DateSettings.DEFAULT_DATE_FORMAT) 
            ?? DateSettings.UNDEFINED_DATE;
        string lastDonatioDate = (await _donationRepository.GetLastDonationDateAsync(donorId))?.ToString(DateSettings.DEFAULT_DATE_FORMAT) 
            ?? DateSettings.UNDEFINED_DATE;

        UserDonationsStatisticsDto statisticsDto = new()
        {
            DonationsCount = await _donationRepository.GetDonationsCountAsync(donorId),
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