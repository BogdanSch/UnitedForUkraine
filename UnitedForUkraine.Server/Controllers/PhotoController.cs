using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhotoController : ControllerBase
{
    private readonly IPhotoService _photoService;

    public PhotoController(IPhotoService photoService)
    {
        _photoService = photoService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile imageFile)
    {
        if (imageFile == null || imageFile.Length > 0)
        {
            BadRequest("Image is null");
        }

        ImageUploadResult result = await _photoService.AddPhotoAsync(imageFile!);

        if(result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }
        return Ok(result.SecureUrl.ToString());
    }
}
