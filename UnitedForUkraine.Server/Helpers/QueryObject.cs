namespace UnitedForUkraine.Server.Helpers;

public class QueryObject
{
    public int Page { get; set; } = 1;
    public string? SearchedQuery { get; set; }
    public string? SortOrder { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public string? Categories { get; set; }
    public string? Statuses { get; set; }
    public string? Currencies { get; set; }
    public string? CampaignIds { get; set; }
}