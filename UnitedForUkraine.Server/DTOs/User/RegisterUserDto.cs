using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User;

public class RegisterUserDto
{
    [DataType(DataType.Text)]
    public required string UserName;
    [DataType(DataType.EmailAddress)]
    public required string Email { get; set; }
    [DataType(DataType.Password)]
    public required string Password { get; set; }
    [DataType(DataType.Password)]
    public required string ConfirmPassword { get; set; }
    public bool RememberMe { get; set; } = false;
}
