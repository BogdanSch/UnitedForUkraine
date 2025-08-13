using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Security.Claims;
using System.Text;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.DTOs.Token;
using UnitedForUkraine.Server.DTOs.User;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IAuthTokenService authTokenService, IEmailService emailService, ILogger<AuthController> logger, IUserService userService) : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly SignInManager<AppUser> _signInManager = signInManager;
        private readonly IAuthTokenService _authTokenService = authTokenService;
        private readonly IEmailService _emailService = emailService;
        private readonly IUserService _userService = userService;
        private readonly ILogger<AuthController> _logger = logger;
        private readonly HashSet<string> _allowedAuthSchemes =
        [
            GoogleDefaults.AuthenticationScheme,
            FacebookDefaults.AuthenticationScheme,
        ];

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            AppUser? user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user is null)
                return BadRequest(new { message = "Invalid email" });

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized(new { message = "Email is not confirmed. Please, check your inbox" });

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid password" });

            IList<string> roles = await _userManager.GetRolesAsync(user);
            (string accessTokenValue, DateTime accessTokenExpirationDate) = _authTokenService.GenerateToken(user, roles);
            (string refreshTokenValue, DateTime refreshTokenExpirationDate) = _authTokenService.GenerateRefreshToken(loginDto.RememberMe);

            user.RefreshToken = refreshTokenValue;
            user.RefreshTokenExpiresAtUtc = refreshTokenExpirationDate;
            await _userManager.UpdateAsync(user);

            TokenDto tokenDto = new()
            {
                AccessToken = accessTokenValue,
                RefreshToken = refreshTokenValue,
                AccessTokenExpirationTime = accessTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_WITH_TIME_FORMAT),
                RefreshTokenExpirationTime = refreshTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_WITH_TIME_FORMAT)
            };

            return Ok(tokenDto);
        }
        [HttpGet("login/{provider:alpha}")]
        public IActionResult HandleExternalLogin([FromRoute] string provider, [FromQuery] string returnUrl)
        {
            string? origin = HttpContext.Request.Host.Value;
            if (string.IsNullOrWhiteSpace(origin))
                return BadRequest(new { message = "Invalid request origin" });

            string authScheme = provider.FirstCharacterToUpper();
            if (!_allowedAuthSchemes.Contains(authScheme))
                return BadRequest(new { message = $"Unsupported authentication provider: {provider}" });

            string uri = $"{HttpContext.Request.Scheme}://{origin}/api/Auth/login/{provider}/callback?returnUrl={returnUrl}";
            AuthenticationProperties properties = _signInManager.ConfigureExternalAuthenticationProperties(authScheme, uri);
            _logger.LogInformation(properties.RedirectUri);

            return Challenge(properties, [authScheme]);
            //return Results.Challenge(properties, [authScheme]);
        }
        [HttpGet("login/{provider:alpha}/callback")]
        public async Task<IActionResult> HandleExternalLoginCallback([FromRoute] string provider, [FromQuery] string returnUrl)
        {
            string authScheme = provider.FirstCharacterToUpper();
            if (!_allowedAuthSchemes.Contains(authScheme))
                return BadRequest(new { message = $"Unsupported authentication provider: {provider}" });

            AuthenticateResult authResult = await HttpContext.AuthenticateAsync(authScheme);
            if (!authResult.Succeeded)
                return Unauthorized(new { message = $"{authScheme} authentication failed. Try again later" });

            ClaimsPrincipal? userPrincipal = authResult.Principal;
            if (userPrincipal is null)
                return Unauthorized(new { message = $"{authScheme} authentication failed, because user claims are empty" });

            string? email = userPrincipal.FindFirstValue(ClaimTypes.Email);
            if (email is null)
                return Unauthorized(new { message = $"{authScheme} authentication failed, because email is empty" });

            AppUser? user = await _userService.GetOrCreateUserAsync(
                email,
                userPrincipal.FindFirstValue(ClaimTypes.GivenName) ?? string.Empty,
                userPrincipal.FindFirstValue(ClaimTypes.MobilePhone) ?? string.Empty,
                null);

            if (user is null)
                return Unauthorized(new { message = $"{authScheme} authentication failed, because we weren't able to create a new user" });

            IList<string> roles = await _userManager.GetRolesAsync(user);
            (string accessTokenValue, DateTime accessTokenExpirationDate) = _authTokenService.GenerateToken(user, roles);
            (string refreshTokenValue, DateTime refreshTokenExpirationDate) = _authTokenService.GenerateRefreshToken(true);

            user.EmailConfirmed = true;
            user.RefreshToken = refreshTokenValue;
            user.RefreshTokenExpiresAtUtc = refreshTokenExpirationDate;
            await _userManager.UpdateAsync(user);

            //string encodedRefreshToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(refreshTokenValue));

            //TokenDto tokenDto = new()
            //{
            //    AccessToken = accessToken,
            //    RefreshToken = refreshTokenValue,
            //    AccessTokenExpirationTime = accessTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
            //    RefreshTokenExpirationTime = refreshTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_FORMAT)
            //};

            Dictionary<string, string?> parameters = new()
            {
                { "accessToken", accessTokenValue },
                { "refreshToken", refreshTokenValue },
                { "accessTokenExpirationTime", accessTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_WITH_TIME_FORMAT) },
                { "refreshTokenExpirationTime", refreshTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_WITH_TIME_FORMAT) }
            };
            string callback = QueryHelpers.AddQueryString(returnUrl, parameters);

            return Redirect(callback);
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequest)
        {
            string? refreshToken = refreshTokenRequest.RefreshToken;

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token's missing" });

            AppUser? user = await _userService.GetUserByRefreshTokenAsync(refreshToken);
            if (user is null)
                return Unauthorized(new { message = "Invalid refresh token" });

            if(user.RefreshTokenExpiresAtUtc < DateTime.UtcNow)
                return Unauthorized(new { message = "Refresh token has already expired" });

            IList<string> roles = await _userManager.GetRolesAsync(user);
            (string accessTokenValue, DateTime accessTokenExpirationDate) = _authTokenService.GenerateToken(user, roles);
            (string refreshTokenValue, DateTime refreshTokenExpirationDate) = _authTokenService.GenerateRefreshToken(true);

            user.RefreshToken = refreshTokenValue;
            user.RefreshTokenExpiresAtUtc = refreshTokenExpirationDate;
            await _userManager.UpdateAsync(user);

            TokenDto tokenDto = new()
            {
                AccessToken = accessTokenValue,
                RefreshToken = refreshTokenValue,
                AccessTokenExpirationTime = accessTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_WITH_TIME_FORMAT),
                RefreshTokenExpirationTime = refreshTokenExpirationDate.ToString(DateSettings.DEFAULT_DATE_WITH_TIME_FORMAT)
            };

            return Ok(tokenDto);
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
                return Conflict(new { message = "Email address's already in use. Please, try a different one" });

            AppUser? newUser = await _userService.GetOrCreateUserAsync(registerDto.Email, registerDto.UserName, registerDto.PhoneNumber, registerDto.Password);
            if (newUser is null)
                return BadRequest(new { message = "An error has occurred during registration. Please, try again later" });

            string emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
            string encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken));

            Dictionary<string, string?> parameters = new()
            {
                { "email", newUser.Email },
                { "token", encodedToken }
            };
            string callback = QueryHelpers.AddQueryString(registerDto.ConfirmEmailClientUri ?? string.Empty, parameters);

            if (!string.IsNullOrWhiteSpace(newUser.Email))
            {
                EmailMetadata emailMetadata = new(newUser.Email, "Confirm your email address");
                await _emailService.SendEmailConfirmationAsync(emailMetadata, callback);
            }

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
            if (!ModelState.IsValid)
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
