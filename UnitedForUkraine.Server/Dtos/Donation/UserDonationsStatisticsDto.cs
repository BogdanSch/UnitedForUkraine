namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class UserDonationsStatisticsDto
    {
        public int DonationsCount { get; set; }
        public decimal TotalDonationsAmount { get; set; }
        public decimal AverageDonationsAmount { get; set; }
        public decimal SmallestDonationAmount { get; set; }
        public decimal BiggestDonationAmount { get; set; }
        public int SupportedCampaignsCount { get; set; }
        public string FirstDonationDate { get; set; } = string.Empty;
        public string LastDonationDate { get; set; } = string.Empty;
    }
}
