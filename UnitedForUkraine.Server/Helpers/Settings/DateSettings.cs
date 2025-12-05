using System.Globalization;

namespace UnitedForUkraine.Server.Helpers.Settings
{
    public static class DateSettings
    {
        public const string DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
        public const string UTC_DATE_FORMAT = "yyyy-MM-ddTHH:mm:ss";
        public const string UNDEFINED_DATE = "N/A";
        public static DateTime ParseDate(string dateString)
        {
            if (!DateTime.TryParseExact(dateString, DEFAULT_DATE_FORMAT, null, DateTimeStyles.None, out DateTime parsedDate))
                return DateTime.UtcNow;
            return parsedDate;
        }
        public static (DateTime, DateTime) ParseStartAndEndDate(string startDateString, string endDateString)
        {
            return (ParseDate(startDateString), ParseDate(endDateString));
        }
    }
}
