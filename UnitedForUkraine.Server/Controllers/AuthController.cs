using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IAuthTokenService _authTokenService;

        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IAuthTokenService authTokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authTokenService = authTokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            AppUser? user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid email or password" });

            string token = _authTokenService.CreateToken(user);

            return Ok(token);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
        {
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords don't match" });
            }

            AppUser? user = await _userManager.FindByEmailAsync(registerDto.Email);

            if (user != null)
            {
                return BadRequest(new { message = "Email address already in use. Please, try again" });
            }

            AppUser newUser = new()
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
            };

            IdentityResult result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(newUser, UserRoles.User);
                // await _signInManager.SignInAsync(newUser, isPersistent: registerDto.RememberMe);

                // string token = GenerateJwtToken(newUser);
                return Ok(new { message = "Registration successful! Now, Please log in!" });
            }

            return BadRequest(new { message = "An error has occured during registration. Try again later!" });
        }
        [HttpGet("userInfo")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Invalid token" });

            AppUser? appUser = await _userManager.FindByIdAsync(userId);
            if (appUser == null)
                return Unauthorized(new { message = "User not found" });

            UserDto userDto = new UserDto()
            {
                Id = appUser.Id,
                Email = appUser.Email!,
                UserName = appUser.UserName!,
                PhoneNumber = appUser.PhoneNumber,
                Address = appUser.Address,
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
