using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Helpers.Settings;

namespace UnitedForUkraine.Server.Services;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    public const int PHOTO_WIDTH = 900;
    public const int PHOTO_HEIGHT = 450;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        Account account = new(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        ImageUploadResult uploadResult = new();

        if (file.Length > 0)
        {
            using (Stream stream = file.OpenReadStream())
            {
                ImageUploadParams uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(PHOTO_HEIGHT).Width(PHOTO_WIDTH).Crop("fill").Gravity("face")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
        }
        return uploadResult;
    }
    public async Task<DeletionResult> RemovePhotoAsync(string publicId)
    {
        DeletionParams deletionParams = new(publicId);
        DeletionResult result = await _cloudinary.DestroyAsync(deletionParams);
        return result;
    }
}
