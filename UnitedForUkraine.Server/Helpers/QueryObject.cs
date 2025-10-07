namespace UnitedForUkraine.Server.Helpers;

public class QueryObject
{
    public int Page { get; set; } = 1;
    public string? SearchedQuery { get; set; }
    public string? SortOrder { get; set; }
    public string? FilterName { get; set; }
    public string FilterCategories { get; set; } = string.Empty;
}

