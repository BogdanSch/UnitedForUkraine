namespace UnitedForUkraine.Server.DTOs.User;

public record PaginatedUsersDto(List<UserDto> Users, bool HasPreviousPage, bool HasNextPage);
