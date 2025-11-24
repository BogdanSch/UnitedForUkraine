using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User;
public record DeleteUserDto
{

    [EmailAddress]
    public required string Email { get; init; }
    [DataType(DataType.Password)]
    public required string Password { get; init; }
}
