using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.User
{
    public class UpdateUserProfileDto
    {
        [DataType(DataType.Text)]
        [MinLength(1)]
        public required string UserName { get; set; }
        [DataType(DataType.PhoneNumber)]
        [StringLength(40, ErrorMessage = "The phone number must be between 7 and 40 characters long.", MinimumLength = 7)]
        public string PhoneNumber { get; set; } = string.Empty;
        [DataType(DataType.Text)]
        [MaxLength(80)]
        [MinLength(1)]
        public string City { get; set; } = string.Empty;
    }
}
