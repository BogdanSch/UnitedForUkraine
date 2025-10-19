using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Models
{
    public class Campaign
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(60)]
        public required string Title { get; set; }
        [MaxLength(50)]
        public required string Slogan { get; set; }
        public required string Description { get; set; }
        [Precision(18, 2)]
        public decimal GoalAmount { get; set; } = 0m;
        [Precision(18, 2)]
        public decimal RaisedAmount { get; set; } = 0m;
        public CurrencyType Currency { get; set; } = CurrencyType.UAH;
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public string ImageUrl { get; set; } = "https://placehold.co/600x400/EEE/31343C";
        public CampaignStatus Status { get; set; } = CampaignStatus.Upcoming;
        public CampaignCategory Category { get; set; } = CampaignCategory.Education;
        public int DonorsCount { get; set; } = 0;
        public ICollection<Donation> Donations { get; } = [];
    }
}