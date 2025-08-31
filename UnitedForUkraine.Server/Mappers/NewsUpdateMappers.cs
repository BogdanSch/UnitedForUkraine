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
                Title = newsUpdate.Title,
                Content = newsUpdate.Content,
                ImageUrl = newsUpdate.ImageUrl,
                ReadingTimeInMinutes = newsUpdate.ReadingTimeInMinutes,
                PostedAt = newsUpdate.PostedAt.ToString(DateSettings.DEFAULT_DATE_FORMAT),
                AuthorName = newsUpdate.User?.UserName ?? "N/A"
            };
        }
        public static NewsUpdate FromCreateNewsUpdateDtoToNewsUpdate(this CreateNewsUpdateRequestDto newsUpdate)
        {
            DateTime postedAt = DateSettings.ParseDate(newsUpdate.PostedAt);

            return new NewsUpdate()
            {
                Title = newsUpdate.Title,
                Content = newsUpdate.Content,
                ImageUrl = newsUpdate.ImageUrl,
                ReadingTimeInMinutes = newsUpdate.ReadingTimeInMinutes,
                PostedAt = postedAt,
                UserId = newsUpdate.AuthorId
            };
        }
    }
}
