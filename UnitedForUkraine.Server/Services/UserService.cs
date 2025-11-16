using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Services
{
    public class UserService(UserManager<AppUser> userManager, ApplicationDbContext context, ILogger<UserService> logger) : IUserService
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<UserService> _logger = logger;

        public async Task<PaginatedList<AppUser>> GetPaginatedUsersAsync(QueryObject queryObject, int itemsPerPageCount)
        {
            IOrderedQueryable<AppUser> users = _userManager.Users.Include(u => u.Address).AsNoTracking().OrderByDescending(u => u.RegisteredAt);
            return await PaginatedList<AppUser>.CreateAsync(users, queryObject.Page, itemsPerPageCount);
        }
        public async Task<AppUser?> GetOrCreateUserAsync(string email, string userName, string? password)
        {
            AppUser? user = await _userManager.FindByEmailAsync(email);
            if (user is not null) return user;

            AppUser newUser = new()
            {
                UserName = userName,
                Email = email,
                PhoneNumber = string.Empty,
                RegisteredAt = DateTime.UtcNow,
                Address = new Address()
            };

            IdentityResult result;
            if (string.IsNullOrWhiteSpace(password))
            {
                result = await _userManager.CreateAsync(newUser);
            }
            else
            {
                result = await _userManager.CreateAsync(newUser, password);
            }

            if (!result.Succeeded)
            {
                string errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogError($"An error has occurred during registration: {errorMessage}");
                return null;
            }

            await _userManager.AddToRoleAsync(newUser, UserRoles.User);
            return newUser;
        }
        public async Task<AppUser?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken)) return null;
            return await _userManager.Users.Include(u => u.Address).FirstOrDefaultAsync(user => user.RefreshToken == refreshToken);
        }
        public async Task<AppUser?> GetByIdAsync(string id)
        {
            if(string.IsNullOrWhiteSpace(id)) return null;
            return await _userManager.Users.Include(u => u.Address).FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<bool> UpdateAsync(AppUser user)
        {
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                string errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogError($"An error has occurred during updating user profile: {errorMessage}");
                return false;
            }
            return true;
        }
    }
}
