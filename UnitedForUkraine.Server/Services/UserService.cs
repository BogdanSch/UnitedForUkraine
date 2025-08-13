using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Services
{
    public class UserService(UserManager<AppUser> userManager, ILogger<UserService> logger) : IUserService
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly ILogger<UserService> _logger = logger;
        public async Task<AppUser?> GetOrCreateUserAsync(string email, string userName, string phoneNumber, string? password)
        {
            AppUser? user = await _userManager.FindByEmailAsync(email);
            if (user is not null) return user;

            AppUser newUser = new()
            {
                UserName = userName,
                Email = email,
                PhoneNumber = phoneNumber
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
            if (string.IsNullOrWhiteSpace(refreshToken))
                return null;

            return await _userManager.Users.FirstOrDefaultAsync(user => user.RefreshToken == refreshToken);
        }
    }
}
