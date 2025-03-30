namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class UpdateCampaignDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal GoalAmount { get; set; }
        public decimal RaisedAmount { get; set; }
        public int Status { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
    }
}
