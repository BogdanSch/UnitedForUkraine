using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.DTOs;
using UnitedForUkraine.Server.DTOs.NewsUpdate;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/newsUpdates")]
public class NewsUpdateController(INewsUpdateRepository newsUpdateRepository) : ControllerBase
{
    private readonly INewsUpdateRepository _newsUpdateRepository = newsUpdateRepository;
    [HttpGet]
    public async Task<IActionResult> GetPaginatedNewsUpdates([FromQuery] QueryObject queryObject)
    {
        PaginatedList<NewsUpdate> paginatedNews = await _newsUpdateRepository.GetPaginatedAsync(queryObject, PaginatedListConstants.PAGE_SIZE);
        List<NewsUpdateDto> newsUpdateDtos = [.. paginatedNews.Select(n => n.ToNewsUpdateDto())];

        return Ok(new PaginatedNewsUpdatesDto(newsUpdateDtos, paginatedNews.HasPreviousPage, paginatedNews.HasNextPage));
    }
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetNewsUpdateDataById([FromRoute] int id)
    {
        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(id);
        if (newsUpdate is null) return NotFound();

        NewsUpdateDto newsUpdateDto = newsUpdate.ToNewsUpdateDto();
        return Ok(newsUpdateDto);
    }
    [HttpPost]
    [Authorize(Roles = UserRoles.Admin)]
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
            return BadRequest(new { message = "Error, we couldn't create a new news update! Please, try again later" });
        }
    }
    [HttpPut("{id:int}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> UpdateNewsUpdate([FromRoute] int id, [FromBody] UpdateNewsUpdateRequestDto updateRequestDto)
    {
        if (!ModelState.IsValid) 
            return BadRequest(ModelState);

        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(id);
        if (newsUpdate is null)
            return NotFound(new { message = "Error, this news update doesn't exist" });

        try
        {
            newsUpdate.Title = updateRequestDto.Title;
            newsUpdate.KeyWords = updateRequestDto.KeyWords;
            newsUpdate.Content = updateRequestDto.Content;
            newsUpdate.ReadingTimeInMinutes = updateRequestDto.ReadingTimeInMinutes;
            if (!string.IsNullOrWhiteSpace(updateRequestDto.ImageUrl))
                newsUpdate.ImageUrl = updateRequestDto.ImageUrl;

            await _newsUpdateRepository.UpdateAsync(newsUpdate);
            return NoContent();
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Error, we weren't able to find this news update! Please, try again later" });
        }
    }
    [HttpPatch("{id:int}")]
    [Authorize]
    public async Task<IActionResult> UpdateNewsUpdateViews([FromRoute] int id)
    {
        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(id);
        if (newsUpdate is null)
            return NotFound(new { message = "Error, this news update doesn't exist" });
        try
        {
            newsUpdate.ViewsCount += 1;
            await _newsUpdateRepository.UpdateAsync(newsUpdate);
            return NoContent();
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Error, we weren't able to update the views count! Please, refresh the page" });
        }
    }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = UserRoles.Admin)]
    public async Task<IActionResult> DeleteNewsUpdate([FromRoute] int id)
    {
        NewsUpdate? newsUpdate = await _newsUpdateRepository.GetByIdAsync(id);
        if (newsUpdate is null)
            return NotFound(new { message = "Error, we weren't able to retrieve the news update" });

        try
        {
            await _newsUpdateRepository.DeleteByIdAsync(id);
            return NoContent();
        }
        catch (Exception)
        {
            return BadRequest(new { message = "Error, we weren't able to delete the news update! Please, try again later" });
        }
    }
}