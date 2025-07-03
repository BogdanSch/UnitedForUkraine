namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class FoundationDonationsStatisticsDto
    {
        public int DonationsCount { get; set; }
        public decimal TotalDonationsAmount { get; set; }
        public int AverageDonationsAmount { get; set; }
        public int UniqueDonorsCount { get; set; }
        public string CityWithMostDonations { get; set; } = string.Empty;
        public string MostFrequentDonorName { get; set; } = string.Empty;
        public decimal DonationsGrowthRate { get; set; }
    }
}
