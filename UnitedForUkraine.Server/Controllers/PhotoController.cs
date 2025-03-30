using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers
{
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService _photoService;

        public PhotoController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromBody] IFormFile imageFile)
        {
            if (imageFile == null)
            {
                BadRequest("Image is null");
            }

            ImageUploadResult result = await _photoService.AddPhotoAsync(imageFile!);

            if(result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
            return Ok(result.PublicId);
        }
    }
}
