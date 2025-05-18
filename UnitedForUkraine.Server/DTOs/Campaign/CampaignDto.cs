using Microsoft.EntityFrameworkCore;

namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class CampaignDto
    {
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required decimal GoalAmount { get; set; }
        public required decimal RaisedAmount { get; set; }
        public required int Status { get; set; }
        public required int Category { get; set; }
        public required int Currency { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public required string ImageUrl { get; set; }
    }
}
