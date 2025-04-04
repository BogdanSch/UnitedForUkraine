using ContosoUniversity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignController : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository;
    private const int ITEMS_PER_QUERY_COUNT = 6;

    public CampaignController(ICampaignRepository campaignRepository)
    {
        _campaignRepository = campaignRepository;
    }

    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaignsData([FromQuery] int page = 1)
    {
        var campaigns = _campaignRepository.GetAllCampaigns();

        if (!campaigns.Any())
        {
            return Ok(new PaginatedCampaignsDto());
        }

        PaginatedList<Campaign> paginatedCampaigns = await PaginatedList<Campaign>.CreateAsync(campaigns, page, ITEMS_PER_QUERY_COUNT);

        List<CampaignDto> campainsList = [.. paginatedCampaigns.Select(c => c.ToCampaignDto())];

        return Ok(new PaginatedCampaignsDto(campainsList, paginatedCampaigns.HasPreviousPage, paginatedCampaigns.HasNextPage));
    }
    [HttpGet("campaigns/{id}")]
    public async Task<IActionResult> GetCampaignsDataById(int id)
    {
        Campaign targetCampaign = await _campaignRepository.GetCampaignById(id);

        if (targetCampaign == null)
            return NotFound();

        CampaignDto campaignDto = targetCampaign.ToCampaignDto();

        return Ok(campaignDto);
    }
    [HttpPost("campaigns/create/")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCampaign(CreateCampaignRequestDto createdCampaignDto)
    {
        try
        {
            Campaign newCampaign = createdCampaignDto.FromCreateCampaignDtoToCampaign();
            await _campaignRepository.Add(newCampaign);
            _campaignRepository.Save();

            return CreatedAtAction(nameof(GetCampaignsDataById), new { id = newCampaign.Id }, newCampaign.ToCampaignDto());
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
    [HttpPut("campaigns/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCampaign(int id, UpdateCampaignRequestDto updatedCampaignDto)
    {
        if (id != updatedCampaignDto.Id)
        {
            return BadRequest();
        }

        Campaign? targetCampaign = await _campaignRepository.GetCampaignById(id);

        if (targetCampaign == null)
        {
            return NotFound();
        }

        try
        {
            (var startDate, var endDate) = CampaignMappers.ParseStartAndEndDate(updatedCampaignDto.StartDate, updatedCampaignDto.EndDate);
            targetCampaign.Title = updatedCampaignDto.Title;
            targetCampaign.Description = updatedCampaignDto.Description;
            targetCampaign.GoalAmount = updatedCampaignDto.GoalAmount;
            targetCampaign.RaisedAmount = updatedCampaignDto.RaisedAmount;
            targetCampaign.Status = (CampaignStatus)updatedCampaignDto.Status;
            //targetCampaign.Currency = newCurrencyType;
            targetCampaign.StartDate = startDate;
            targetCampaign.EndDate = endDate;

            if (updatedCampaignDto.ImageUrl != null)
                targetCampaign.ImageUrl = updatedCampaignDto.ImageUrl;


            _campaignRepository.Save();
        }
        catch (Exception)
        {
            return NotFound();
        }
        return NoContent();
    }
    [HttpDelete("campaigns/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCampaign(int id)
    {
        await _campaignRepository.Delete(id);
        return NoContent();
    }
}
