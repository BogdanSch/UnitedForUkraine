using ContosoUniversity;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignController : ControllerBase
{
    private readonly ICampaignRepository _campaignRepository;
    private const int ITEMS_PER_QUERY_COUNT = 6;
    private const string DEFAULT_DATE_FORMAT = "MM-dd-yyyy HH:mm:ss";

    public CampaignController(ICampaignRepository campaignRepository)
    {
        _campaignRepository = campaignRepository;
    }

    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaignsData([FromQuery] int page = 1)
    {
        var campaigns = _campaignRepository.GetAllCampaigns();
        PaginatedList<Campaign> paginatedCampaigns = await PaginatedList<Campaign>.CreateAsync(campaigns, page, ITEMS_PER_QUERY_COUNT);

        List<CampaignDto> campainsList = [.. paginatedCampaigns.Select(c => new CampaignDto()
        {
            Id = c.Id,
            Title = c.Title,
            Description = c.Description,
            GoalAmount = c.GoalAmount,
            RaisedAmount = c.RaisedAmount,
            Status = Enum.GetName(c.Status)!,
            Currency = Enum.GetName(c.Currency)!,
            StartDate = c.StartDate.ToString(DEFAULT_DATE_FORMAT),
            EndDate = c.EndDate.ToString(DEFAULT_DATE_FORMAT),
            ImageUrl = c.ImageUrl
        })];

        return Ok(new PaginatedCampaignsDto() { Campaigns = campainsList, HasPreviousPage = paginatedCampaigns.HasPreviousPage, HasNextPage = paginatedCampaigns.HasNextPage});
    }
    [HttpGet("campaigns/{id}")]
    public async Task<IActionResult> GetCampaignsDataById(int id)
    {
        Campaign targetCampaign = await _campaignRepository.GetCampaignById(id);

        if (targetCampaign == null)
            return NotFound();

        CampaignDto campaignDto = new()
        {
            Id = targetCampaign.Id,
            Title = targetCampaign.Title,
            Description = targetCampaign.Description,
            GoalAmount = targetCampaign.GoalAmount,
            RaisedAmount = targetCampaign.RaisedAmount,
            Status = Enum.GetName(targetCampaign.Status)!,
            Currency = Enum.GetName(targetCampaign.Currency)!,
            StartDate = targetCampaign.StartDate.ToString(DEFAULT_DATE_FORMAT),
            EndDate = targetCampaign.EndDate.ToString(DEFAULT_DATE_FORMAT),
            ImageUrl = targetCampaign.ImageUrl
        };

        return Ok(campaignDto);
    }
    [HttpPut("campaigns/{id}")]
    public async Task<IActionResult> PutCampaign(int id, CampaignDto updatedCampaignDto)
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

        if(!Enum.TryParse(updatedCampaignDto.Status, true, out CampaignStatus newStatus)) 
            return BadRequest($"Invalid campaign status: {updatedCampaignDto.Status}");
        if(Enum.TryParse(updatedCampaignDto.Currency, out CurrencyType newCurrencyType))
            return BadRequest($"Invalid currency type: {updatedCampaignDto.Currency}");
        if (!DateTime.TryParseExact(updatedCampaignDto.StartDate, DEFAULT_DATE_FORMAT, null, DateTimeStyles.None, out var newStartDate))
            return BadRequest($"Invalid start date format: {updatedCampaignDto.StartDate}");
        if (!DateTime.TryParseExact(updatedCampaignDto.EndDate, DEFAULT_DATE_FORMAT, null, DateTimeStyles.None, out var newEndDate))
            return BadRequest($"Invalid end date format: {updatedCampaignDto.EndDate}");

        targetCampaign.Title = updatedCampaignDto.Title;
        targetCampaign.Description = updatedCampaignDto.Description;
        targetCampaign.GoalAmount = updatedCampaignDto.GoalAmount;
        targetCampaign.RaisedAmount = updatedCampaignDto.RaisedAmount;
        targetCampaign.Status = newStatus;
        targetCampaign.Currency = newCurrencyType;
        targetCampaign.StartDate = newStartDate;
        targetCampaign.EndDate = newEndDate;
        targetCampaign.ImageUrl = updatedCampaignDto.ImageUrl;

        try
        {
            _campaignRepository.Save();
        }
        catch (Exception)
        {
            return NotFound();
        }

        return NoContent();
    }
    [HttpDelete("campaigns/{id}")]
    public async Task<IActionResult> DeleteTodoItem(int id)
    {
        await _campaignRepository.Delete(id);
        return NoContent();
    }
}
