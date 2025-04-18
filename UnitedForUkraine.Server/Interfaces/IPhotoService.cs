using CloudinaryDotNet.Actions;

namespace UnitedForUkraine.Server.Interfaces;

public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
    Task<DeletionResult> RemovePhotoAsync(string publicId);
}
