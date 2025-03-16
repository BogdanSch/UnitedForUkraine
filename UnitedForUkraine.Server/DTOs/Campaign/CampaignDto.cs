using Microsoft.EntityFrameworkCore;

namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class CampaignDto
    {
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        [Precision(18, 2)]
        public required decimal GoalAmount { get; set; }

        [Precision(18, 2)]
        public required decimal RaisedAmount { get; set; }
        public required string Status { get; set; }
        public required string Currency { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public required string ImageUrl { get; set; }
    }
}
