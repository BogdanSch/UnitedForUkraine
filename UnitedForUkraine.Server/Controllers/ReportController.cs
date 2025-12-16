using FluentEmail.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportController(IReportService reportService, IDonationRepository donationRepository, IReceiptRepository receiptRepository, IUserService userService, IEmailService emailService) : ControllerBase
{
    public const string RECEIPT_PREFIX = "receipt-";
    private readonly IReportService _reportService = reportService;
    private readonly IDonationRepository _donationRepository = donationRepository;
    private readonly IReceiptRepository _receiptRepository = receiptRepository;
    private readonly IUserService _userService = userService;
    private readonly IEmailService _emailService = emailService;
    [HttpGet]
    public async Task<IActionResult> GetFoundationReport([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        DateTime boundaryEnd = end.AddDays(1);

        ReportStats stats = await _reportService.GetStatisticsAsync(start, boundaryEnd);
        byte[] excelFile = _reportService.GenerateExcelReport(stats, start, end);

        return File(
            excelFile,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"Report_{start:yyyyMMdd}_{end:yyyyMMdd}.xlsx");
    }
    [HttpGet("receipt")]
    [Authorize]
    public async Task<IActionResult> GetTransactionReceipt([FromQuery] int donationId)
    {
        Donation? donation = await _donationRepository.GetByIdAsync(donationId);
        if(donation is null || donation.Status != DonationStatus.Completed)
            return BadRequest(new { message = "Invalid donation" } );

        string? senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(senderId))
            return Unauthorized(new { message = "Invalid user Id" });
        if (senderId != donation.UserId)
            return Forbid();
        AppUser? user = await _userService.GetByIdAsync(donation.UserId);
        if (user is null)
            return NotFound(new { message = "User was not found" });

        Receipt? receipt = await _receiptRepository.GetByDonationIdAsync(donationId);
        if(receipt is null)
            return NotFound(new { message = "Receipt was not found" });

        byte[] pdf = _reportService.GeneratePdfDonationReceipt(donation, receipt);
        using MemoryStream stream = new(pdf);
        Attachment document = new()
        {
            Filename = $"{RECEIPT_PREFIX}{receipt.ReceiptNumber}.pdf",
            ContentType = "application/pdf",
            Data = stream,
        };

        EmailMetadata emailMetadata = new(user.Email!, "Transaction confirmation")
        {
            Attachments = [document]
        };
        await _emailService.SendReceiptAsync(emailMetadata, user.UserName!);

        return Ok();
    }
}
