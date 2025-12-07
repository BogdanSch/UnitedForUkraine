using UnitedForUkraine.Server.DTOs.NewsUpdate;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers
{
    public static class NewsUpdateMappers
    {
        public static NewsUpdateDto ToNewsUpdateDto(this NewsUpdate newsUpdate) 
        {
            return new NewsUpdateDto()
            {
                Id = newsUpdate.Id,
                TargetCampaign = newsUpdate.TargetCampaign.ToCampaignDto(),
                Title = newsUpdate.Title,
                KeyWords = newsUpdate.KeyWords,
                Content = newsUpdate.Content,
                ImageUrl = newsUpdate.ImageUrl,
                ReadingTimeInMinutes = newsUpdate.ReadingTimeInMinutes,
                ViewsCount = newsUpdate.ViewsCount,
                PostedAt = newsUpdate.PostedAt.ToString(DateSettings.DEFAULT_DATE_FORMAT),
                AuthorName = newsUpdate.Author?.UserName ?? "N/A"
            };
        }
        public static NewsUpdate FromCreateNewsUpdateDtoToNewsUpdate(this CreateNewsUpdateRequestDto newsUpdate)
        {
            return new NewsUpdate()
            {
                Title = newsUpdate.Title,
                KeyWords = newsUpdate.KeyWords,
                Content = newsUpdate.Content,
                ImageUrl = newsUpdate.ImageUrl,
                ReadingTimeInMinutes = newsUpdate.ReadingTimeInMinutes,
                PostedAt = DateTime.UtcNow,
                AuthorId = newsUpdate.AuthorId,
                CampaignId = newsUpdate.CampaignId,
                ViewsCount = 0
            };
        }
    }
}
