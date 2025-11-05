using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces
{
    public interface IUserService
    {
        Task<PaginatedList<AppUser>> GetPaginatedUsersAsync(QueryObject queryObject, int itemsPerPageCount);
        Task<AppUser?> GetOrCreateUserAsync(string email, string userName, string? password);
        Task<AppUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<AppUser?> GetByIdAsync(string id);
    }
}
