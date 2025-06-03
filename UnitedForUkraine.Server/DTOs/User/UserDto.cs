using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User
{
    public class UserDto
    {
        public required string Id { get; set; }
        [DataType(DataType.Text)]
        public required string UserName { get; set; }
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
    }
}
