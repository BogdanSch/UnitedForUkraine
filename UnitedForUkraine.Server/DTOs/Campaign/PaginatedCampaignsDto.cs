namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class PaginatedCampaignsDto
    {
        public PaginatedCampaignsDto(List<CampaignDto> campaigns, bool hasPreviousPage, bool hasNextPage)
        {
            Campaigns = campaigns;
            HasPreviousPage = hasPreviousPage;
            HasNextPage = hasNextPage;
        }
        public PaginatedCampaignsDto() : this([], false, false) { }

        public List<CampaignDto> Campaigns { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
    }
}
