using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers;

public static class CampaignMappers
{
    public static CampaignDto ToCampaignDto(this Campaign campaign, bool isLiked = false)
    {
        return new CampaignDto
        {
            Id = campaign.Id,
            Title = campaign.Title,
            Slogan = campaign.Slogan,
            Description = campaign.Description,
            GoalAmount = campaign.GoalAmount,
            RaisedAmount = campaign.RaisedAmount,
            Status = (int)campaign.Status,
            Currency = (int)campaign.Currency,
            Category = (int)campaign.Category,
            StartDate = campaign.StartDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
            EndDate = campaign.EndDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
            ImageUrl = campaign.ImageUrl,
            DonorsCount = campaign.DonorsCount,
            IsLiked = isLiked,
        };
    }
    public static Campaign FromCreateCampaignDtoToCampaign(this CreateCampaignRequestDto newCampaign)
    {
        (var startDate, var endDate) = DateSettings.ParseStartAndEndDate(newCampaign.StartDate, newCampaign.EndDate);

        return new Campaign
        {
            Title = newCampaign.Title,
            Slogan = newCampaign.Slogan,
            Description = newCampaign.Description,
            GoalAmount = newCampaign.GoalAmount,
            RaisedAmount = 0,
            Status = (CampaignStatus)newCampaign.Status,
            Currency = (CurrencyType)newCampaign.Currency,
            Category = (CampaignCategory)newCampaign.Category,
            StartDate = startDate,
            EndDate = endDate,
            ImageUrl = newCampaign.ImageUrl
        };
    }
}
