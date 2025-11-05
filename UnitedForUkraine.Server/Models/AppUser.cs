using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class AppUser : IdentityUser
{
    [StringLength(512, ErrorMessage = "Refresh token must be at most 512 characters long")]
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAtUtc { get; set; }
    [ForeignKey(nameof(Address))]
    public int AddressId { get; set; }
    public Address Address { get; set; } = null!;
    public required DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}
