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
using UnitedForUkraine.Server.Extensions;
using UnitedForUkraine.Server.Helpers;
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
            TokenObject token = _authTokenService.CreateToken(user, roles, loginDto.RememberMe);

            user.RefreshToken = token.RefreshToken;
            user.RefreshTokenExpiresAtUtc = token.RefreshTokenExpirationTime;
            await _userManager.UpdateAsync(user);

            _authTokenService.SetTokensInsideCookie(token, HttpContext);
            TokenDateDto tokenDateDto = new()
            {
                // AccessToken = token.AccessTokenValue,
                // RefreshToken = token.RefreshTokenValue,
                AccessTokenExpirationTime = token.AccessTokenExpirationTime.ToString(DateSettings.UTC_DATE_FORMAT),
                RefreshTokenExpirationTime = token.RefreshTokenExpirationTime.ToString(DateSettings.UTC_DATE_FORMAT)
            };

            return Ok(tokenDateDto);
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
                null);
            if (user is null)
                return Unauthorized(new { message = $"{authScheme} authentication failed, because we weren't able to create a new user" });

            IList<string> roles = await _userManager.GetRolesAsync(user);
            TokenObject token = _authTokenService.CreateToken(user, roles, true);

            user.EmailConfirmed = true;
            user.RefreshToken = token.RefreshToken;
            user.RefreshTokenExpiresAtUtc = token.RefreshTokenExpirationTime;
            await _userManager.UpdateAsync(user);

            _authTokenService.SetTokensInsideCookie(token, HttpContext);

            Dictionary<string, string?> parameters = new()
            {
                //{ "accessToken", token.AccessTokenValue },
                //{ "refreshToken", token.RefreshTokenValue },
                { "accessTokenExpirationTime", token.AccessTokenExpirationTime.ToString(DateSettings.UTC_DATE_FORMAT) },
                { "refreshTokenExpirationTime", token.RefreshTokenExpirationTime.ToString(DateSettings.UTC_DATE_FORMAT) }
            };
            string callback = QueryHelpers.AddQueryString(returnUrl, parameters);

            return Redirect(callback);
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            //HttpContext.Request.Cookies.TryGetValue("accessToken", out var accessToken);
            HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            if(string.IsNullOrWhiteSpace(refreshToken))
                return Unauthorized(new { message = "The refresh token was empty" });

            AppUser? user = await _userService.GetUserByRefreshTokenAsync(refreshToken);
            if (user is null)
                return Unauthorized(new { message = "Invalid refresh token" });
            if (user.RefreshTokenExpiresAtUtc < DateTime.UtcNow)
                return Unauthorized(new { message = "Refresh token has already expired" });

            IList<string> roles = await _userManager.GetRolesAsync(user);
            TokenObject token = _authTokenService.CreateToken(user, roles, true);

            user.RefreshToken = token.RefreshToken;
            user.RefreshTokenExpiresAtUtc = token.RefreshTokenExpirationTime;
            await _userManager.UpdateAsync(user);

            _authTokenService.SetTokensInsideCookie(token, HttpContext);

            TokenDateDto tokenDateDto = new()
            {
                // AccessToken = token.AccessTokenValue,
                // RefreshToken = token.RefreshTokenValue,
                AccessTokenExpirationTime = token.AccessTokenExpirationTime.ToString(DateSettings.UTC_DATE_FORMAT),
                RefreshTokenExpirationTime = token.RefreshTokenExpirationTime.ToString(DateSettings.UTC_DATE_FORMAT)
            };
            return Ok(tokenDateDto);
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
                return Conflict(new { message = "The email address is already in use. Please, try a different one" });

            AppUser? newUser = await _userService.GetOrCreateUserAsync(registerDto.Email, registerDto.UserName, registerDto.Password);
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
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileDto updateProfileDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Invalid user confirmation token" });
            AppUser? appUser = await _userService.GetByIdAsync(userId);
            if (appUser is null)
                return Unauthorized(new { message = "User was not found" });

            try
            {
                appUser.UserName = updateProfileDto.UserName;
                appUser.PhoneNumber = updateProfileDto.PhoneNumber;

                appUser.Address.Country = updateProfileDto.UpdatedAddress.Country;
                appUser.Address.City = updateProfileDto.UpdatedAddress.City;
                appUser.Address.Region = updateProfileDto.UpdatedAddress.Region;
                appUser.Address.Street = updateProfileDto.UpdatedAddress.Street;
                appUser.Address.PostalCode = updateProfileDto.UpdatedAddress.PostalCode;

                bool isUpdated = await _userService.UpdateAsync(appUser);

                if (isUpdated) return Ok(new { message = "Profile information was successfully updated" });
                return BadRequest(new { message = "An error has occurred during the profile update. Please, try again later" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, message: $"Error updating profile for user {userId}");
                return BadRequest(new { message = "An error has occurred during the profile update. Please, try again later" });
            }
        }
        [HttpGet("userInfo")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Invalid user confirmation token" });

            AppUser? appUser = await _userService.GetByIdAsync(userId);
            if (appUser is null)
                return Unauthorized(new { message = "User was not found" });

            UserDto userDto = appUser.ToDto();
            userDto.IsAdmin = await _userManager.IsInRoleAsync(appUser, UserRoles.Admin);

            return Ok(userDto);
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetPaginatedAppUsers([FromQuery] QueryObject queryObject)
        {
            PaginatedList<AppUser> paginatedUsers = await _userService.GetPaginatedUsersAsync(queryObject, PaginatedListConstants.PAGE_SIZE);
            List<UserDto> newsUpdateDtos = [.. paginatedUsers.Select(u => u.ToDto())];

            return Ok(new PaginatedUsersDto(newsUpdateDtos, paginatedUsers.HasPreviousPage, paginatedUsers.HasNextPage));
        }
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Successfully logged out" });
        }
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserDto deleteUserDto)
        {
            if(!ModelState.IsValid) 
                return BadRequest(ModelState);

            AppUser? user = await _userManager.FindByEmailAsync(deleteUserDto.Email);
            if (user is null)
                return NotFound(new { message = $"User with email={deleteUserDto.Email} was not found" });

            bool isPasswordValid = await _userManager.CheckPasswordAsync(user, deleteUserDto.Password);
            if (!isPasswordValid)
                return BadRequest(new { password = "Incorrect password" });

            IdentityResult result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { message = "Deletion failed. Try again later" });

            return Ok(new { message = "Account deleted" });
        }
    }
}
