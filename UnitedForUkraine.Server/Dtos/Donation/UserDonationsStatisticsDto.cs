namespace UnitedForUkraine.Server.Dtos.Donation
{
    public class UserDonationsStatisticsDto
    {
        public int DonationsCount { get; set; }
        public decimal TotalDonationsAmount { get; set; }
        public decimal AverageDonationsAmount { get; set; }
        public int SupportedCampaignsCount { get; set; }
    }
}
