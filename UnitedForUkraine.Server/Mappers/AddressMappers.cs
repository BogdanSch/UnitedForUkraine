using UnitedForUkraine.Server.DTOs.Address;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers
{
    public static class AddressMappers
    {
        public static AddressDto ToAddressDto(this Address address)  => new()
            {
                Country = address.Country ?? string.Empty,
                Region =  address.Region ?? string.Empty,
                City =  address.City ?? string.Empty,
                Street =  address.Street ?? string.Empty,
                PostalCode =  address.PostalCode ?? string.Empty,
            };
    }
}
