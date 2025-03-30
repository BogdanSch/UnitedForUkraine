namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class PaginatedDonationsDto
    {
        public PaginatedDonationsDto(List<DonationDto> donations, bool hasNextPage)
        {
            Donations = donations;
            HasNextPage = hasNextPage;
        }
        public PaginatedDonationsDto() : this([], false) { }
        public List<DonationDto> Donations { get; set; } = new List<DonationDto>();
        public bool HasNextPage { get; set; } = false;
    }
}
