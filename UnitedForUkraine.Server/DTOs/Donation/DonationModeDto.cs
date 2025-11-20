namespace UnitedForUkraine.Server.DTOs.Donation;
public record DonationModeDto
{
    public decimal Amount { get; init; }
    public int Currency { get; init; }
}
