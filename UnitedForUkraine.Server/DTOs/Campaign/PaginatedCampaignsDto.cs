namespace UnitedForUkraine.Server.DTOs.Campaign;

public record PaginatedCampaignsDto(List<CampaignDto> Campaigns, bool HasPreviousPage, bool HasNextPage);
