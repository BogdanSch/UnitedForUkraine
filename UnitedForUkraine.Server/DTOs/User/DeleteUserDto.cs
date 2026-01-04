using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User;
public record DeleteUserDto
{
    [EmailAddress]
    public required string ConfirmEmail { get; init; }
    [DataType(DataType.Password)]
    public string? Password { get; init; } = string.Empty;
}
