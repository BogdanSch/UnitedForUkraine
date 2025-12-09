namespace UnitedForUkraine.Server.DTOs.Campaign;

public record CampaignStatistics
{
    public required int NewsUpdatesCount { get; init; }
    public required int DonationsCount { get; init; }
    public required decimal RepeatDonorRate { get; init; }
}
