namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class PaginatedDonationsDto(List<DonationDto> donations, bool hasNextPage)
    {
        public PaginatedDonationsDto() : this([], false) { }
        public List<DonationDto> Donations { get; set; } = donations;
        public bool HasNextPage { get; set; } = hasNextPage;
    }
}
