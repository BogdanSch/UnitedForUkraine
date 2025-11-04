using UnitedForUkraine.Server.DTOs.User;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers;

public static class AppUserMappers
{
    public static UserDto ToDto(this AppUser user) => new()
    {
        Id = user.Id,
        Email = user.Email!,
        UserName = user.UserName ?? string.Empty,
        PhoneNumber = user.PhoneNumber ?? string.Empty,
        RegisteredAt = user.RegisteredAt.ToString(DateSettings.DEFAULT_DATE_FORMAT),
        Address = user.Address.ToAddressDto(),
        IsAdmin = false
    };
}
