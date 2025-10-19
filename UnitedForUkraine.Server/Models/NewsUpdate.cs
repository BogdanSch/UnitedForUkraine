using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models
{
    public class NewsUpdate
    {
        [Key]
        public int Id { get; set; }
        [StringLength(100, MinimumLength = 10)]
        public required string Title { get; set; }
        [StringLength(160, MinimumLength = 10)]
        public required string KeyWords { get; set; }
        [MinLength(20)]
        public required string Content { get; set; }
        public required string ImageUrl { get; set; } = "https://placehold.co/600x400/EEE/31343C";
        [Range(1, 60)]
        public required int ReadingTimeInMinutes { get; set; }
        public required int ViewsCount { get; set; } = 0;
        public required DateTime PostedAt { get; set; }

        [ForeignKey(nameof(AppUser))]
        public required string AuthorId { get; set; }
        public AppUser? Author { get; set; }
        [ForeignKey(nameof(Campaign))]
        public required int CampaignId { get; set; }
        public Campaign? TargetCampaign { get; set; }
    }
}
