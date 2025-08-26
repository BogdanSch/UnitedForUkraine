namespace UnitedForUkraine.Server.Helpers;

public record TokenObject(string AccessToken, DateTime AccessTokenExpirationTime, string RefreshToken, DateTime RefreshTokenExpirationTime) { }