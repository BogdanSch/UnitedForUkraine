namespace UnitedForUkraine.Server.Dtos.Donation
{
    public class UserDonationsStatisticsDto
    {
        public int DonationsCount { get; set; }
        public decimal TotalDonationsAmount { get; set; }
        public decimal AverageDonationsAmount { get; set; }
        public decimal SmallestDonationAmount { get; set; }
        public decimal BiggestDonationAmount { get; set; }
        public int SupportedCampaignsCount { get; set; }
    }
}
