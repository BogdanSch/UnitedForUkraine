using System.Globalization;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers
{
    public static class CampaignMappers
    {
        public static (DateTime start, DateTime end) ParseStartAndEndDate(string startDate, string endDate)
        {
            if (!DateTime.TryParseExact(startDate, DateSettings.DEFAULT_DATE_FORMAT, null, DateTimeStyles.None, out var parsedStartDate))
                throw new Exception($"Invalid start date format: {startDate}");
            if (!DateTime.TryParseExact(endDate, DateSettings.DEFAULT_DATE_FORMAT, null, DateTimeStyles.None, out var parsedEndDate))
                throw new Exception($"Invalid end date format: {endDate}");

            return (parsedStartDate, parsedEndDate);
        }
        public static CampaignDto ToCampaignDto(this Campaign campaign)
        {
            return new CampaignDto
            {
                Id = campaign.Id,
                Title = campaign.Title,
                Description = campaign.Description,
                GoalAmount = campaign.GoalAmount,
                RaisedAmount = campaign.RaisedAmount,
                Status = (int)campaign.Status,
                Currency = (int)campaign.Currency,
                StartDate = campaign.StartDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
                EndDate = campaign.EndDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
                ImageUrl = campaign.ImageUrl
            };
        }
        public static Campaign FromCreateCampaignDtoToCampaign(this CreateCampaignRequestDto newCampaign)
        {
            (var startDate, var endDate) = ParseStartAndEndDate(newCampaign.StartDate, newCampaign.EndDate);

            return new Campaign
            {
                Title = newCampaign.Title,
                Description = newCampaign.Description,
                GoalAmount = newCampaign.GoalAmount,
                RaisedAmount = 0,
                Status = (CampaignStatus)newCampaign.Status,
                Currency = (CurrencyType)newCampaign.Currency,
                StartDate = startDate,
                EndDate = endDate,
                ImageUrl = newCampaign.ImageUrl
            };
        }
    }
}
