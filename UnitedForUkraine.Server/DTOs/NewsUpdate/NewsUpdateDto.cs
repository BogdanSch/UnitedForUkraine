namespace UnitedForUkraine.Server.DTOs.NewsUpdate;

public record NewsUpdateDto
{
    public required int Id { get; init; }
    public required string Title { get; init; }
    public required string Content { get; init; }
    public required string ImageUrl { get; init; }
    public required int ReadingTimeInMinutes { get; init; }
    public required string PostedAt { get; init; }
    public required string AuthorName { get; init; }
}