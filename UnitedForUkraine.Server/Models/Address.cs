using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class Address
{
    [Key]
    public int Id { get; set; }
    [StringLength(80)]
    public string? Country { get; set; } = null;
    [StringLength(100)]
    public string? Region { get; set; } = null;
    [StringLength(100)]
    public string? City { get; set; } = null;
    [StringLength(120)]
    public string? Street { get; set; } = string.Empty;
    [StringLength(20)]
    public string? PostalCode { get; set; } = string.Empty;
    [ForeignKey(nameof(AppUser))]
    public string UserId { get; set; } = null!;
    public AppUser User { get; set; } = null!;
}

