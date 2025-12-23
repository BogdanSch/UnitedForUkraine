using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers; 

[ApiController]
[Route("api/campaigns")]
public class CampaignController(ICampaignRepository campaignRepository, INewsUpdateRepository newsUpdateRepository, IDonationRepository donationRepository) : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository = campaignRepository;
    private readonly INewsUpdateRepository _newsUpdateRepository = newsUpdateRepository;
    private readonly IDonationRepository _donationRepository = donationRepository;

    [HttpGet]
    public async Task<IActionResult> GetPaginatedCampaignsData([FromQuery] QueryObject queryObject)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        PaginatedList<CampaignDto> paginatedCampaigns = await _campaignRepository.GetPaginatedCampaigns(queryObject, PaginatedListConstants.PAGE_SIZE, userId: userId);
        List<CampaignDto> campainsList = [.. paginatedCampaigns];

        return Ok(new PaginatedCampaignsDto(campainsList, paginatedCampaigns.HasPreviousPage, paginatedCampaigns.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCampaignDataById([FromRoute] int id)
    {
        Campaign? targetCampaign = await _campaignRepository.GetByIdAsync(id);

        if (targetCampaign is null)
            return NotFound();

        bool isLiked = false;

        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrWhiteSpace(userId))
            isLiked = await _campaignRepository.IsCampaignLikedByUser(id, userId);

        CampaignDto campaignDto = targetCampaign.ToCampaignDto(isLiked);
        return Ok(campaignDto);
    }
    [HttpGet("{id:int}/statistics")]
    public async Task<IActionResult> GetCampaignStatistics([FromRoute] int id)
    {
        Campaign? targetCampaign = await _campaignRepository.GetByIdAsync(id);
        if (targetCampaign == null)
            return NotFound();
        return Ok(new CampaignStatistics() 
        { 
            DonationsCount = await _donationRepository.GetDonationsCountByCampaingIdAsync(id),
            RepeatDonorRate = await _donationRepository.GetReapeatDonorsRate(id),
            NewsUpdatesCount = await _newsUpdateRepository.GetNewsUpdatesCountByCampaignIdAsync(id)
        });
    }
    [HttpGet("users/{userId:guid}/supports")]
    [Authorize]
    public async Task<IActionResult> GetPaginatedUserSupportedCampaigns([FromRoute] Guid userId, [FromQuery] QueryObject queryObject)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest(new { message = "The user id can't be empty" });

        PaginatedList<CampaignDto> paginatedCampaigns = await _campaignRepository.GetPaginatedUserSupportedCampaignsAsync(queryObject, PaginatedListConstants.PAGE_SIZE, userId.ToString());
        List<CampaignDto> campainsList = [.. paginatedCampaigns];

        return Ok(new PaginatedCampaignsDto(campainsList, paginatedCampaigns.HasPreviousPage, paginatedCampaigns.HasNextPage));
    }
    [HttpGet("liked")]
    [Authorize]
    public async Task<IActionResult> GetPaginatedLikedCampaignsData([FromQuery] QueryObject queryObject)
    {
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { message = "Invalid user confirmation token. Please log in again!" });

        PaginatedList<CampaignDto> paginatedCampaigns = await _campaignRepository.GetPaginatedCampaigns(queryObject, PaginatedListConstants.PAGE_SIZE, true, userId);
        List<CampaignDto> campainsList = [.. paginatedCampaigns];

        return Ok(new PaginatedCampaignsDto(campainsList, paginatedCampaigns.HasPreviousPage, paginatedCampaigns.HasNextPage));
    }
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> CreateCampaign([FromBody] CreateCampaignRequestDto createdCampaignDto)
    {
        if(!ModelState.IsValid) return BadRequest(ModelState);
        try
        {
            Campaign newCampaign = createdCampaignDto.FromCreateCampaignDtoToCampaign();
            await _campaignRepository.AddAsync(newCampaign);
            return CreatedAtAction(nameof(GetCampaignDataById), new { id = newCampaign.Id }, newCampaign.ToCampaignDto());
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
    [HttpPost("{id:int}/like")]
    [Authorize]
    public async Task<IActionResult> LikeOrDislikeCampaign([FromRoute] int id)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new { message = "Invalid user confirmation token. Please log in again!" });

        try
        {
            Campaign? campaign = await _campaignRepository.GetByIdAsync(id);
            if(campaign is null)
                return BadRequest(new { message = "Could not like the campaign. Please, select a valid campaign!" });

            bool isNowLiked = await _campaignRepository.LikeOrDislikeCampaignAsync(id, userId);
            return Ok(isNowLiked);
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Could not like the campaign. Please, try again later!" });
        }
    }
    [HttpPut("{id:int}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> UpdateCampaign([FromRoute] int id, [FromBody] UpdateCampaignRequestDto updatedCampaignDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (id != updatedCampaignDto.Id)
            return BadRequest(new { message = "The identifiers of the campaigns don't match!" });

        Campaign? targetCampaign = await _campaignRepository.GetByIdAsync(id);
        if (targetCampaign is null)
            return NotFound();

        try
        {
            (var startDate, var endDate) = DateSettings.ParseStartAndEndDate(updatedCampaignDto.StartDate, updatedCampaignDto.EndDate);

            targetCampaign.Title = updatedCampaignDto.Title;
            targetCampaign.Slogan = updatedCampaignDto.Slogan;
            targetCampaign.Description = updatedCampaignDto.Description;
            targetCampaign.GoalAmount = updatedCampaignDto.GoalAmount;
            targetCampaign.Status = (CampaignStatus)updatedCampaignDto.Status;
            targetCampaign.Category = (CampaignCategory)updatedCampaignDto.Category;
            targetCampaign.StartDate = startDate;
            targetCampaign.EndDate = endDate;

            if (!string.IsNullOrWhiteSpace(updatedCampaignDto.ImageUrl))
                targetCampaign.ImageUrl = updatedCampaignDto.ImageUrl;
            
            await _campaignRepository.UpdateAsync(targetCampaign);
        }
        catch (Exception)
        {
            return NotFound();
        }

        return NoContent();
    }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> DeleteCampaign([FromRoute] int id)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        await _campaignRepository.DeleteAsync(id);
        return NoContent();
    }
}
