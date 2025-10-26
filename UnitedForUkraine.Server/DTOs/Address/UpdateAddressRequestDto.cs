using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Address;

public record UpdateAddressRequestDto
{
    [StringLength(80)]
    public string Country { get; init; } = string.Empty;
    [StringLength(100)]
    public string Region { get; init; } = string.Empty;
    [StringLength(100)]
    public string City { get; init; } = string.Empty;
    [StringLength(120)]
    public string Street { get; init; } = string.Empty;
    [StringLength(20)]
    public string PostalCode { get; init; } = string.Empty;
}