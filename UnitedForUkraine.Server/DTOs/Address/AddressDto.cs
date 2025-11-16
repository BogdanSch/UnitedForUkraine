namespace UnitedForUkraine.Server.DTOs.Address;

public record AddressDto
{
    public int Id { get; init; }
    public string Country { get; init; } = string.Empty;
    public string Region { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string Street { get; init; } = string.Empty;
    public string PostalCode { get; init; } = string.Empty;
}