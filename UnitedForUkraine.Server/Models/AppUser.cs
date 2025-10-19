using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class AppUser : IdentityUser
{
    [StringLength(80, MinimumLength = 1)]
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAtUtc { get; set; }
    [ForeignKey(nameof(Address))]
    public int UserAddressId { get; set; }
    public Address? UserAddress { get; set; }
    public required DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}
