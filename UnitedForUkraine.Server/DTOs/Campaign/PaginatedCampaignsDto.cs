namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class PaginatedCampaignsDto(List<CampaignDto> campaigns, bool hasPreviousPage, bool hasNextPage)
    {
        public PaginatedCampaignsDto() : this([], false, false) { }

        public List<CampaignDto> Campaigns { get; set; } = campaigns;
        public bool HasPreviousPage { get; set; } = hasPreviousPage;
        public bool HasNextPage { get; set; } = hasNextPage;
    }
}
