using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models
{
    public class NewsUpdate
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public required string Title { get; set; }
        [MinLength(20)]
        public required string Content { get; set; }
        public required string ImageUrl { get; set; } = "https://placehold.co/600x400/EEE/31343C";
        [Range(1, 60)]
        public required int ReadingTimeInMinutes { get; set; }
        public required DateTime PostedAt { get; set; }

        [ForeignKey(nameof(AppUser))]
        public required string UserId { get; set; }
        public AppUser? User { get; set; }
    }
}
