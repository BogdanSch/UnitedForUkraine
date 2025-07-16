using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Interfaces;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using UnitedForUkraine.Server.Helpers.Settings;
using Microsoft.AspNetCore.Authentication.Google;

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
        //private readonly IHttpContextAccessor _context = httpContext;
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
        private async Task<AppUser?> CreateNewUser(string email, string userName, string phoneNumber, string? password)
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
        [HttpGet("login/google")]
        public IResult GoogleLogin([FromQuery] string returnUrl)
        {
            string? origin = HttpContext.Request.Host.Value;
            if (string.IsNullOrWhiteSpace(origin))
                return Results.BadRequest(new { message = "Invalid request origin" });

            string uri = $"{HttpContext.Request.Scheme}://{origin}/api/Auth/login/google/callback?returnUrl={returnUrl}";
            AuthenticationProperties properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", uri);
            return Results.Challenge(properties, ["Google"]);
        }
        [HttpGet("login/google/callback")]
        public async Task<IActionResult> GoogleLoginCallback([FromQuery] string returnUrl)
        {
            AuthenticateResult authResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!authResult.Succeeded)
                return Unauthorized(new { message = "Google authentication failed" });

            ClaimsPrincipal? userPrincipal = authResult.Principal;
            if (userPrincipal is null)
                return Unauthorized(new { message = "Google authentication failed as claims are empty" });

            string? email = userPrincipal.FindFirstValue(ClaimTypes.Email);
            if(email is null)
                return Unauthorized(new { message = "Google authentication failed as email is empty" });

            AppUser? user = await CreateNewUser(
                email,
                userPrincipal.FindFirstValue(ClaimTypes.GivenName) ?? string.Empty,
                userPrincipal.FindFirstValue(ClaimTypes.MobilePhone) ?? string.Empty,
                null);

            if(user is null)
                return Unauthorized(new { message = "Google authentication failed as we weren't able to create a new user" });

            await _signInManager.SignInAsync(user, isPersistent: true);

            IList<string> roles = await _userManager.GetRolesAsync(user);
            string token = _authTokenService.CreateToken(user, roles, true);

            string redirectUrl = QueryHelpers.AddQueryString(returnUrl, "token", token);
            return Redirect(redirectUrl);
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
                return BadRequest(new { message = "Email address's already in use. Please, try again" });

            AppUser? newUser = await CreateNewUser(registerDto.Email, registerDto.UserName, registerDto.PhoneNumber, registerDto.Password);
            if(newUser is null)
                return BadRequest(new { message = "An error has occurred during registration. Please, try again later" });

            string emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
            string encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken));

            Dictionary<string, string?> parameters = new()
            {
                { "email", newUser.Email },
                { "token", encodedToken }
            };
            string callback = QueryHelpers.AddQueryString(registerDto.ConfirmEmailClientUri ?? string.Empty, parameters);

            EmailMetadata emailMetadata = new(newUser.Email!, "Confirm your email address");
            await _emailService.SendEmailConfirmationAsync(emailMetadata, callback);

            return Ok(new { message = "Successful registration! We've sent you a verification token via email! Now, please, confirm your email" });
        }
        [HttpGet("emailConfirmation")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
        {
            AppUser? user = await _userManager.FindByEmailAsync(email);
            if (user is null)
                return BadRequest(new { message = "Invalid email address" });

            string decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
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
