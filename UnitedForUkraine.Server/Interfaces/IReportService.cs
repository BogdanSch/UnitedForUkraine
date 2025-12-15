using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Interfaces;

public interface IReportService
{
    Task<ReportStats> GetStatisticsAsync(DateTime startDate, DateTime endDate);
    byte[] GenerateExcelReport(ReportStats stats, DateTime startDate, DateTime endDate);
    byte[] GeneratePdfDonationReceipt(Donation donation, Receipt receipt);
}
