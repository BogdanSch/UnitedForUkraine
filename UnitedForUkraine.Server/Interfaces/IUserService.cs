using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces
{
    public interface IUserService
    {
        Task<PaginatedList<AppUser>> GetPaginatedUsersAsync(QueryObject queryObject, int itemsPerPageCount);
        Task<AppUser?> GetOrCreateUserAsync(string email, string userName, string phoneNumber, string? password);
        Task<AppUser?> GetUserByRefreshTokenAsync(string refreshToken);
    }
}
