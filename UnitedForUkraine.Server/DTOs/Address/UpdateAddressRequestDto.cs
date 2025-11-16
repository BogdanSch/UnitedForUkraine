using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Address;
public class UpdateAddressRequestDto
{
    [StringLength(80)]
    public string Country { get; set; } = string.Empty;
    [StringLength(100)]
    public string Region { get; set; } = string.Empty;
    [StringLength(100)]
    public string City { get; set; } = string.Empty;
    [StringLength(120)]
    public string Street { get; set; } = string.Empty;
    [StringLength(20)]
    public string PostalCode { get; set; } = string.Empty;
}
