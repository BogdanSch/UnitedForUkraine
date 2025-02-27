using System.ComponentModel.DataAnnotations;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.DTOs.User
{
    public class UserDto
    {
        public required string Id { get; set; }
        [DataType(DataType.Text)]
        public required string UserName { get; set; }

        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }
        public Address? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
