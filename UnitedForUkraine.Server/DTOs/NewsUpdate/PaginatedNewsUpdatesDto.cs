namespace UnitedForUkraine.Server.DTOs.NewsUpdate;
public record PaginatedNewsUpdatesDto(List<NewsUpdateDto> NewsUpdates, bool HasPreviousPage, bool HasNextPage);