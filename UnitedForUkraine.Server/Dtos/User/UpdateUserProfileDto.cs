using System.ComponentModel.DataAnnotations;
using UnitedForUkraine.Server.DTOs.Address;

namespace UnitedForUkraine.Server.DTOs.User
{
    public class UpdateUserProfileDto
    {
        [DataType(DataType.Text)]
        [MinLength(1)]
        public required string UserName { get; set; }
        [DataType(DataType.PhoneNumber)]
        [StringLength(40, ErrorMessage = "The phone number must be at most 40 characters long.")]
        public string PhoneNumber { get; set; } = string.Empty;
        public required UpdateAddressRequestDto UpdatedAddress { get; set; }
    }
}
