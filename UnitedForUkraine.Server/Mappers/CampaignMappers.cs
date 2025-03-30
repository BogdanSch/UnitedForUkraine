using UnitedForUkraine.Server.DTOs.Campaign;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers
{
    public static class CampaignMappers
    {
        public static CampaignDto ToCampaignDto(this Campaign campaign)
        {
            return new CampaignDto
            {
                Id = campaign.Id,
                Title = campaign.Title,
                Description = campaign.Description,
                GoalAmount = campaign.GoalAmount,
                RaisedAmount = campaign.RaisedAmount,
                Status = Enum.GetName(campaign.Status)!,
                Currency = Enum.GetName(campaign.Currency)!,
                StartDate = campaign.StartDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
                EndDate = campaign.EndDate.ToString(DateSettings.DEFAULT_DATE_FORMAT),
                ImageUrl = campaign.ImageUrl
            };
        }
    }
}
