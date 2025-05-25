using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class AppUser : IdentityUser
{
    [ForeignKey(nameof(Address))]
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
}
