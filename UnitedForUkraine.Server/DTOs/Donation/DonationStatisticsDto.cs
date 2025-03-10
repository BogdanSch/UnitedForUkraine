namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class DonationStatisticsDto
    {
        public int DonationsCount { get; set; }
        public decimal TotalDonationsAmount { get; set; }
        public int AverageDonationsAmount { get; set; }
        public int UniqueDonorsCount { get; set; }
    }
}
