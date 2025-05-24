namespace UnitedForUkraine.Server.Helpers.Settings
{
    public class JwtSettings
    {
        public required string SecretKey { get; set; }
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public int ExpiryDays { get; set; }
    }
}
