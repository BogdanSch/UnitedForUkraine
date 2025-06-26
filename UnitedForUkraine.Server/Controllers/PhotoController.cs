using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/photos")]
public class PhotoController(IPhotoService photoService) : ControllerBase
{
    private readonly IPhotoService _photoService = photoService;

    [HttpPost]
    public async Task<IActionResult> UploadPhoto([FromForm] IFormFile imageFile)
    {
        if (imageFile == null || imageFile.Length <= 0)
        {
            BadRequest(new { message = "Image is empty!" });
        }

        ImageUploadResult result = await _photoService.AddPhotoAsync(imageFile!);

        if(result.Error != null)
            return BadRequest(new { message = result.Error.Message });

        return Ok(result.SecureUrl.ToString());
    }
    [HttpDelete("{publicId}")]
    public async Task<IActionResult> DeletePhotoById([FromRoute] string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
            BadRequest(new { message = "Image's public id is empty!" });

        DeletionResult result = await _photoService.RemovePhotoAsync(publicId);

        if (result.Error != null)
            return BadRequest(new { message = result.Error.Message });

        return NoContent();
    }
}
