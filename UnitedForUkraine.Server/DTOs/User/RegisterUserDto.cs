using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User;

public record RegisterUserDto
{
    public required string UserName { get; init; } = string.Empty;
    [EmailAddress]
    public required string Email { get; init; }
    [DataType(DataType.Password)]
    public required string Password { get; init; }
    [DataType(DataType.Password)]
    public required string ConfirmPassword { get; init; }
    public string? ConfirmEmailClientUri { get; init; } = string.Empty;
}
