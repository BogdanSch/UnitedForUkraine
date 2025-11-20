namespace UnitedForUkraine.Server.DTOs.Donation
{
    public record FoundationDonationsStatisticsDto
    {
        public int DonationsCount { get; init; }
        public int CampaignsCount { get; init; }
        public decimal TotalDonationsAmount { get; init; }
        public int AverageDonationsAmount { get; init; }
        public required DonationModeDto MostFrequentDonation { get; init; }
        public int UniqueDonorsCount { get; init; }
        public string CityWithMostDonations { get; init; } = string.Empty;
        public string CountryWithMostDonations { get; init; } = string.Empty;
        public string MostFrequentDonorName { get; init; } = string.Empty;
        public decimal DonationsGrowthRate { get; init; }
    }
}
