namespace UnitedForUkraine.Server.Helpers.Settings
{
    public class JwtSettings
    {
        public required string SecretKey { get; set; }
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public int AccessTokenExpirationTimeInMinutes { get; set; }
        public int RefreshTokenExpirationTimeInDays { get; set; }
    }
}
