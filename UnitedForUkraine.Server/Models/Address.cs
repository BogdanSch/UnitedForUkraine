using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class Address
{
    [Key]
    public int Id { get; set; }
    public string? Country { get; set; } = string.Empty;
    public string? Region { get; set; } = string.Empty;
    public string? City { get; set; } = string.Empty;
    public string? Street { get; set; } = string.Empty;
    public string? PostalCode { get; set; } = string.Empty;

    [ForeignKey(nameof(AppUser))]
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
}

