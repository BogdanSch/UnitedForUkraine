using CloudinaryDotNet.Actions;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IAuthTokenService
{
    public string CreateToken(AppUser user);
}
