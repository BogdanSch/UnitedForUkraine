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
public class CampaignController(ICampaignRepository campaignRepository) : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository = campaignRepository;
    private const int NUMBER_OF_ITEMS_PER_PAGE = 6;

    [HttpGet]
    public async Task<IActionResult> GetPaginatedCampaignsData([FromQuery] QueryObject queryObject)
    {
        var paginatedCampaigns = await _campaignRepository.GetPaginatedCampaigns(queryObject, NUMBER_OF_ITEMS_PER_PAGE);
        List<CampaignDto> campainsList = [.. paginatedCampaigns.Select(c => c.ToCampaignDto())];

        return Ok(new PaginatedCampaignsDto(campainsList, paginatedCampaigns.HasPreviousPage, paginatedCampaigns.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCampaignDataById([FromRoute] int id)
    {
        Campaign? targetCampaign = await _campaignRepository.GetByIdAsync(id);

        if (targetCampaign == null)
            return NotFound();

        CampaignDto campaignDto = targetCampaign.ToCampaignDto();

        return Ok(campaignDto);
    }
    [HttpGet("users/{userId:guid}/supports")]
    [Authorize]
    public async Task<IActionResult> GetUserSupportedCampaigns([FromRoute] Guid userId)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        if (userId == Guid.Empty)
            return BadRequest(new { message = "The user id can't be empty" });

        List<CampaignDto> campaignDtos = await _campaignRepository.GetAllUserSupportedCampaignsAsync(userId.ToString());
        return Ok(new { Campaigns = campaignDtos });
    }
    [HttpPost]
    [Authorize(Roles = "admin")]
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
    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin")]
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
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteCampaign([FromRoute] int id)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _campaignRepository.DeleteAsync(id);
        return NoContent();
    }
}
