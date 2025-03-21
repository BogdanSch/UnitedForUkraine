namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class LoadedDonationsDto
    {
        public List<DonationDto> Donations { get; set; } = new List<DonationDto>();
        public bool HasNextPage { get; set; } = false;
    }
}
