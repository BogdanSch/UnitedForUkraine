using Microsoft.AspNetCore.Mvc;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportController(IReportService reportService) : ControllerBase
{
    private readonly IReportService _reportService = reportService;
    [HttpGet]
    public async Task<IActionResult> GetFoundationReport([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        ReportStats stats = await _reportService.GetStatisticsAsync(start, end);
        byte[] excelFile = _reportService.GenerateExcelReport(stats, start, end);

        return File(
            excelFile,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"Report_{start:yyyyMMdd}_{end:yyyyMMdd}.xlsx");
    }
    //[HttpGet]
    //public async Task<IActionResult> GetTransactionReceipt([FromQuery] )
    //{
    //    ReportStats stats = await _reportService.GetStatisticsAsync(start, end);
    //    byte[] excelFile = _reportService.GenerateExcelReport(stats);

    //    return File(
    //        excelFile,
    //        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //        $"Report_{start:yyyyMMdd}_{end:yyyyMMdd}.xlsx");
    //}
}
