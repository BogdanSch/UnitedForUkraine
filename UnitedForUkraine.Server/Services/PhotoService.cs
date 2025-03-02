using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Helpers;

namespace UnitedForUkraine.Server.Services;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    private readonly int PHOTO_DIMENSION = 500;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        Account account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
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
                    Transformation = new Transformation().Height(this.PHOTO_DIMENSION).Width(this.PHOTO_DIMENSION).Crop("fill").Gravity("face")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
        }
        return uploadResult;
    }
    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        DeletionParams deletionParams = new(publicId);
        DeletionResult result = await _cloudinary.DestroyAsync(deletionParams);
        return result;
    }
}
