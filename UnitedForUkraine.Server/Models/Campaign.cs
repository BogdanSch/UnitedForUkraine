using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Models
{
    public class Campaign
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(50)]
        public required string Title { get; set; }
        public required string Description { get; set; }
        [Precision(18, 2)]
        public decimal GoalAmount { get; set; }

        [Precision(18, 2)]
        public decimal RaisedAmount { get; set; }
        public CurrencyType Currency { get; set; } = CurrencyType.UAH;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ImageUrl { get; set; } = "https://placehold.co/600x400/EEE/31343C";
        public CampaignStatus Status { get; set; } = CampaignStatus.Upcoming;
        public CampaignCategory Category { get; set; } = CampaignCategory.Education;
    }
}