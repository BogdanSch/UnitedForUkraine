using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class AppUser : IdentityUser
{
    [StringLength(512, ErrorMessage = "Refresh token must be at most 512 characters long")]
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAtUtc { get; set; }
    public required DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public Address Address { get; set; } = null!;
}
