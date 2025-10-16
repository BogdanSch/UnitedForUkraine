using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.Models;

public class AppUser : IdentityUser
{
    [StringLength(80, MinimumLength = 1)]
    public string? City { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAtUtc { get; set; } 
    //public DateTime RegisteredAtUtc { get; set; } = DateTime.UtcNow;
}
