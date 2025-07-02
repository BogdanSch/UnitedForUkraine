using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User;

public class RegisterUserDto
{
    public required string UserName { get; set; } = string.Empty;
    [EmailAddress]
    public required string Email { get; set; }
    [DataType(DataType.Password)]
    public required string Password { get; set; }
    [DataType(DataType.Password)]
    public required string ConfirmPassword { get; set; }
    [DataType(DataType.PhoneNumber)]
    [StringLength(40, ErrorMessage = "The phone number must be between 7 and 40 characters long.", MinimumLength = 7)]
    public required string PhoneNumber { get; set; }
    public string? ConfirmEmailClientUri { get; set; } = string.Empty;
}
