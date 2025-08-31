using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.NewsUpdate
{
    public record CreateNewsUpdateRequestDto
    {
        [MaxLength(100)]
        public required string Title { get; init; }
        [MinLength(20)]
        public required string Content { get; init; }
        public required string ImageUrl { get; init; }
        [Range(1, 60)]
        public required int ReadingTimeInMinutes { get; init; }
        public required string PostedAt { get; init; }
        public required string AuthorId { get; init; }
    }
}
