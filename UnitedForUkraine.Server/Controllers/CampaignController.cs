using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
public class CampaignController : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository;
    private const int NUMBER_OF_CAMPAIGNS_PER_PAGE = 6;

    public CampaignController(ICampaignRepository campaignRepository)
    {
        _campaignRepository = campaignRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetPaginatedCampaignsData([FromQuery] QueryObject queryObject)
    {
        var paginatedCampaigns = await _campaignRepository.GetPaginatedCampaigns(queryObject, NUMBER_OF_CAMPAIGNS_PER_PAGE);
        List<CampaignDto> campainsList = [.. paginatedCampaigns.Select(c => c.ToCampaignDto())];

        return Ok(new PaginatedCampaignsDto(campainsList, paginatedCampaigns.HasPreviousPage, paginatedCampaigns.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCampaignDataById([FromRoute] int id)
    {
        Campaign? targetCampaign = await _campaignRepository.GetCampaignByIdAsync(id);

        if (targetCampaign == null)
            return NotFound();

        CampaignDto campaignDto = targetCampaign.ToCampaignDto();

        return Ok(campaignDto);
    }
    [HttpGet("supported-by/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetUserSupportedCampaigns(Guid userId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest(new { message = "User's ID cannot be empty." });

        var campaigns = await _campaignRepository.GetAllUserSupportedCampaigns(userId.ToString()).ToListAsync();
        List<CampaignDto> campaignDtos = [.. campaigns.Select(c => c.ToCampaignDto())];

        return Ok(new { Campaigns = campaignDtos });
    }
    [HttpPost("create/")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateCampaign([FromBody] CreateCampaignRequestDto createdCampaignDto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);

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
    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateCampaign([FromRoute] int id, [FromBody] UpdateCampaignRequestDto updatedCampaignDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (id != updatedCampaignDto.Id)
            return BadRequest(new { message = "IDs of the campaigns don't match!" });

        Campaign? targetCampaign = await _campaignRepository.GetCampaignByIdAsync(id);

        if (targetCampaign == null)
            return NotFound();

        try
        {
            (var startDate, var endDate) = DateSettings.ParseStartAndEndDate(updatedCampaignDto.StartDate, updatedCampaignDto.EndDate);

            targetCampaign.Title = updatedCampaignDto.Title;
            targetCampaign.Description = updatedCampaignDto.Description;
            targetCampaign.GoalAmount = updatedCampaignDto.GoalAmount;
            targetCampaign.Status = (CampaignStatus)updatedCampaignDto.Status;
            targetCampaign.Category = (CampaignCategory)updatedCampaignDto.Category;
            targetCampaign.StartDate = startDate;
            targetCampaign.EndDate = endDate;

            if (updatedCampaignDto.ImageUrl != null)
            {
                targetCampaign.ImageUrl = updatedCampaignDto.ImageUrl;
            }

            await _campaignRepository.UpdateAsync(targetCampaign);
        }
        catch (Exception)
        {
            return NotFound();
        }

        return NoContent();
    }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteCampaign([FromRoute] int id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _campaignRepository.DeleteAsync(id);
        return NoContent();
    }
}
