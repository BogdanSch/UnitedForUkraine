using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.NewsUpdate
{
    public record CreateNewsUpdateRequestDto
    {
        [StringLength(100, MinimumLength = 10)]
        public required string Title { get; init; }
        [MinLength(20)]
        public required string Content { get; init; }
        public required string ImageUrl { get; init; }
        [Range(1, 60)]
        public required int ReadingTimeInMinutes { get; init; }
        public required string AuthorId { get; init; }
        public required int CampaignId { get; init; }
    }
}
