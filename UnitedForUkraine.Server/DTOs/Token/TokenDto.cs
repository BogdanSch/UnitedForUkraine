namespace UnitedForUkraine.Server.DTOs.Token;

public record TokenDto
{
    public string AccessToken { get; init; } = string.Empty;
    public string AccessTokenExpirationTime { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public string RefreshTokenExpirationTime { get; init; } = string.Empty;
}
