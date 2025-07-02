using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.Models;

public class AppUser : IdentityUser
{
    [MaxLength(80)]
    [MinLength(1)]
    public string? City { get; set; } = string.Empty;
}
