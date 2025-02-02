using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.Models;

public class Address
{
    [Key]
    public int Id { get; set; }
    [MaxLength(50)]
    public required string Street { get; set; }
    [MaxLength(50)]
    public required string City { get; set; }
    [MaxLength(50)]
    public required string Country { get; set; }
}
