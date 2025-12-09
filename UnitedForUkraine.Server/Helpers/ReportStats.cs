using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Helpers;

public record ReportStats
{
    public required int DonationsCount { get; init; }
    public required int UsersCount { get; init; }
    public required int UniqueDonors {  get; init; }
    public required int CampaignsCount { get; init; }
    public required int NewsUpdatesCount { get; init; }
    public required decimal TotalAmount { get; init; }
    public required decimal MaxDonation { get; init; }
    public required decimal AverageDonation { get; init; }
    public required decimal MinDonation { get; init; }
    public required (decimal, CurrencyType) ModeDonation { get; init; }
    public required (string, int) MostFrequentDonorStats { get; init; }
}
