using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.DTOs.User;
using Microsoft.AspNetCore.Authorization;

namespace UnitedForUkraine.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _config;

        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Invalid email or password" });

            string token = GenerateJwtToken(user);

            return Ok(token);
        }
        [HttpGet("userInfo")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Invalid token" });

            AppUser? appUser = await _userManager.FindByIdAsync(userId);
            if(appUser == null)
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
            await _signInManager.SignOutAsync(:);
            return Ok(new { message = "Successfully logged out" });
        }

        private string GenerateJwtToken(AppUser user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!)
            };

            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            JwtSecurityToken tokenDescriptor = new (
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
