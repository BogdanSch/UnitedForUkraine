using UnitedForUkraine.Server.Helpers;

namespace UnitedForUkraine.Server.Interfaces;

public interface IReportService
{
    Task<ReportStats> GetStatisticsAsync(DateTime startDate, DateTime endDate);
    byte[] GenerateExcelReport(ReportStats stats, DateTime startDate, DateTime endDate);
}
