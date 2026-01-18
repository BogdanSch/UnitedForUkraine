using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.NewsUpdate
{
    public record UpdateNewsUpdateRequestDto
    {
        public required int Id { get; init; }
        [StringLength(100, MinimumLength = 10)]
        public required string Title { get; init; }
        [StringLength(180, MinimumLength = 10)]
        public required string KeyWords { get; init; }
        [StringLength(512, MinimumLength = 20)]
        public required string Preview { get; set; }
        [MinLength(20)]
        public required string Content { get; init; }
        [Range(1, 60)]
        public required int ReadingTimeInMinutes { get; init; }
        public string ImageUrl { get; init; } = string.Empty;
    }
}
