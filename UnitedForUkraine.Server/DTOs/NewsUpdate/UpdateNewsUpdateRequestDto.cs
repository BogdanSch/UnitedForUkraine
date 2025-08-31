using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.NewsUpdate
{
    public record UpdateNewsUpdateRequestDto
    {
        public required int Id { get; init; }
        [MaxLength(100)]
        public required string Title { get; init; }
        [MinLength(20)]
        public required string Content { get; init; }
        public string? ImageUrl { get; init; }
        [Range(1, 60)]
        public required int ReadingTimeInMinutes { get; init; }
    }
}
