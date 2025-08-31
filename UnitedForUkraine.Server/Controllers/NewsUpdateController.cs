using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.DTOs;
using UnitedForUkraine.Server.DTOs.NewsUpdate;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

public class NewsUpdateController(INewsUpdateRepository newsUpdateRepository) : ControllerBase
{
    private readonly INewsUpdateRepository _newsUpdateRepository = newsUpdateRepository;
    private const int NUMBER_OF_ITEMS_PER_PAGE = 6;
    [HttpGet]
    public async Task<IActionResult> GetPaginatedNewsUpdates([FromQuery] QueryObject queryObject)
    {
        PaginatedList<NewsUpdate> paginatedNews = await _newsUpdateRepository.GetPaginatedAsync(queryObject, NUMBER_OF_ITEMS_PER_PAGE);
        List<NewsUpdateDto> newsUpdateDtos = [.. paginatedNews.Select(n => n.ToNewsUpdateDto())];

        return Ok(new PaginatedNewsUpdatesDto(newsUpdateDtos, paginatedNews.HasPreviousPage, paginatedNews.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetNewsUpdateDataById([FromRoute] int id)
    {
        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(id);

        if (newsUpdate is null)
            return NotFound();

        NewsUpdateDto newsUpdateDto = newsUpdate.ToNewsUpdateDto();

        return Ok(newsUpdateDto);
    }
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CreateNewsUpdate([FromBody] CreateNewsUpdateRequestDto createNewsUpdate)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            NewsUpdate newsUpdate = createNewsUpdate.FromCreateNewsUpdateDtoToNewsUpdate();
            await _newsUpdateRepository.AddAsync(newsUpdate);

            return Ok(new CreationResultDto(newsUpdate.Id.ToString()));
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Error, we weren't able to create a new blog post" });
        }
    }
    [HttpPut]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateNewsUpdate([FromBody] UpdateNewsUpdateRequestDto updateRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(updateRequestDto.Id);

        if (newsUpdate is null)
            return NotFound(new { message = "Error, we weren't able to retrieve this blog post" });

        try
        {
            newsUpdate.Title = updateRequestDto.Title;
            newsUpdate.Content = updateRequestDto.Content;
            newsUpdate.ReadingTimeInMinutes = updateRequestDto.ReadingTimeInMinutes;
            if (!string.IsNullOrWhiteSpace(updateRequestDto.ImageUrl))
                newsUpdate.ImageUrl = updateRequestDto.ImageUrl;

            await _newsUpdateRepository.UpdateAsync(newsUpdate);

            return NoContent();
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Error, we weren't able to update this blog post" });
        }
    }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteNewsUpdate([FromRoute] int id)
    {
        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(id);

        
    }
}