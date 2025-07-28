using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces
{
    public interface IUserService
    {
        Task<AppUser?> GetOrCreateUserAsync(string email, string userName, string phoneNumber, string? password);
    }
}
