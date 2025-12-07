namespace UnitedForUkraine.Server.DTOs.Donation
{
    public record FoundationDonationsStatisticsDto
    {
        public required int DonationsCount { get; init; }
        public required int CampaignsCount { get; init; }
        public required decimal TotalDonationsAmount { get; init; }
        public required decimal BiggestDonationAmount { get; init; }
        public required int AverageDonationsAmount { get; init; }
        public required decimal SmallestDonationAmount { get; init; }
        public required DonationModeDto MostFrequentDonation { get; init; }
        public required int UniqueDonorsCount { get; init; }
        public required string CityWithMostDonations { get; init; } = string.Empty;
        public required string CountryWithMostDonations { get; init; } = string.Empty;
        public required string MostFrequentDonorName { get; init; } = string.Empty;
        public required decimal DonationsGrowthRate { get; init; }
    }
}
