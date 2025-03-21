namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class PaginatedCampaignsDto
    {
        public List<CampaignDto> Campaigns { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
    }
}
