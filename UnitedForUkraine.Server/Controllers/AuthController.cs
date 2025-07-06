using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Interfaces;
using Microsoft.AspNetCore.WebUtilities;

namespace UnitedForUkraine.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IAuthTokenService authTokenService, IEmailService emailService, ILogger<AuthController> logger) : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly SignInManager<AppUser> _signInManager = signInManager;
        private readonly IAuthTokenService _authTokenService = authTokenService;
        private readonly IEmailService _emailService = emailService;
        private readonly ILogger<AuthController> _logger = logger;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            AppUser? user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user is null)
                return BadRequest(new { message = "Invalid email" });

            if(!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized(new { message = "Email is not confirmed. Please, check your inbox" });

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid password" });

            IList<string> roles = await _userManager.GetRolesAsync(user);

            string token = _authTokenService.CreateToken(user, roles, loginDto.RememberMe);

            return Ok(token);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (registerDto.Password != registerDto.ConfirmPassword)
                return BadRequest(new { message = "Passwords don't match" });

            AppUser? user = await _userManager.FindByEmailAsync(registerDto.Email);

            if (user is not null)
                return BadRequest(new { message = "Email address already in use. Please, try again" });

            AppUser newUser = new()
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber
            };

            IdentityResult result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if(!result.Succeeded)
            {
                string errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = $"An error has occurred during registration: {errorMessage}" });
            }

            await _userManager.AddToRoleAsync(newUser, UserRoles.User);

            string emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
            string encodedToken = WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(emailConfirmationToken));

            Dictionary<string, string?> parameters = new()
            {
                { "email", newUser.Email },
                { "token", encodedToken }
            };
            string callback = QueryHelpers.AddQueryString(registerDto.ConfirmEmailClientUri ?? string.Empty, parameters);

            EmailMetadata emailMetadata = new(newUser.Email, "Confirm your email address");
            await _emailService.SendEmailConfirmationAsync(emailMetadata, callback);

            return Ok(new { message = "Registration successful! We've sent you a verification token via email! Now, please, confirm your email!" });
        }
        [HttpGet("emailConfirmation")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
        {
            AppUser? user = await _userManager.FindByEmailAsync(email);
            if (user is null)
                return BadRequest(new { message = "Invalid email address" });

            string decodedToken = System.Text.Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            IdentityResult confirmationResult = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!confirmationResult.Succeeded)
                return BadRequest(new { message = $"Invalid email confirmation request" });

            return NoContent();
        }
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateUserProfileInfo([FromBody] UpdateUserProfileDto updateProfileDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Invalid user confirmation token" });

            AppUser? appUser = await _userManager.FindByIdAsync(userId);
            if (appUser is null)
                return Unauthorized(new { message = "User was not found" });

            try
            {
                appUser.UserName = updateProfileDto.UserName;
                appUser.PhoneNumber = updateProfileDto.PhoneNumber;
                appUser.City = updateProfileDto.City;

                IdentityResult result = await _userManager.UpdateAsync(appUser);

                if (!result.Succeeded)
                {
                    string errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                    return BadRequest(new { message = $"An error has occurred during profile update: {errorMessage}" });
                }

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, message: $"Error updating profile for user {userId}");
                return Unauthorized(new { message = "Something weird has happened on our side" });
            }
        }
        [HttpGet("userInfo")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Invalid user confirmation token" });

            AppUser? appUser = await _userManager.FindByIdAsync(userId);
            if (appUser is null)
                return Unauthorized(new { message = "User was not found" });

            UserDto userDto = new()
            {
                Id = appUser.Id,
                Email = appUser.Email!,
                UserName = appUser.UserName!,
                PhoneNumber = appUser.PhoneNumber ?? string.Empty,
                City = appUser.City ?? string.Empty,
                IsAdmin = await _userManager.IsInRoleAsync(appUser, UserRoles.Admin)
            };
            return Ok(userDto);
        }
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Successfully logged out" });
        }
    }
}
