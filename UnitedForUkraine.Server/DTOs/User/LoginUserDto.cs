using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User;

public class LoginUserDto
{
    [EmailAddress]
    public required string Email { get; set; }
    [DataType(DataType.Password)]
    public required string Password { get; set; }
    public bool RememberMe { get; set; } = false;
}
