namespace UnitedForUkraine.Server.DTOs.Campaign;

public record CampaignDto
{
    public required int Id { get; init; }
    public required string Title { get; init; }
    public required string Slogan { get; init; }
    public required string Description { get; init; }
    public required decimal GoalAmount { get; init; }
    public required decimal RaisedAmount { get; init; }
    public required int DonorsCount { get; init; }
    public required int Status { get; init; }
    public required int Category { get; init; }
    public required int Currency { get; init; }
    public required string StartDate { get; init; }
    public required string EndDate { get; init; }
    public required string ImageUrl { get; init; }
    public bool IsLiked { get; init; } = false;
}

