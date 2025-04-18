﻿using System.Globalization;

namespace UnitedForUkraine.Server.Helpers
{
    public static class DateSettings
    {
        public const string DEFAULT_DATE_FORMAT = "MM-dd-yyyy";
        public static DateTime ParseDate(string dateString)
        {
            if (!DateTime.TryParseExact(dateString, DEFAULT_DATE_FORMAT, null, DateTimeStyles.None, out DateTime parsedDate))
                throw new Exception($"Invalid start date format: {dateString}");

            return parsedDate;
        }
        public static (DateTime, DateTime) ParseStartAndEndDate(string startDateString, string endDateString)
        {
            return (ParseDate(startDateString), ParseDate(endDateString));
        }
    }
}
