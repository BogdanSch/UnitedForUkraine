using ClosedXML.Excel;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Services
{
    public class ReportService(IDonationRepository donationRepository, IUserService userService, INewsUpdateRepository newsUpdateRepository, ICampaignRepository campaignRepository) : IReportService
    {
        private readonly IDonationRepository _donationRepository = donationRepository;
        private readonly INewsUpdateRepository _newsUpdateRepository = newsUpdateRepository;
        private readonly ICampaignRepository _campaignRepository = campaignRepository;
        private readonly IUserService _userService = userService;

        public async Task<ReportStats> GetStatisticsAsync(DateTime startDate, DateTime endDate)
        {
            return new ReportStats
            {
                DonationsCount = await _donationRepository.GetTotalDonationsCountAsync(start: startDate, end: endDate),
                UsersCount = await _userService.GetNumberOfRegisteredUsers(start: startDate, end: endDate),
                UniqueDonors = await _donationRepository.GetUniqueDonorsCountAsync(start: startDate, end: endDate),
                CampaignsCount = await _campaignRepository.GetTotalCampaignsCountAsync(start: startDate, end: endDate),
                NewsUpdatesCount = await _newsUpdateRepository.GetNewsUpdatesCount(start: startDate, end: endDate),
                TotalAmount = await _donationRepository.GetTotalDonationsAmountAsync(start: startDate, end: endDate),
                MaxDonation = await _donationRepository.GetBiggestDonationAmountAsync(start: startDate, end: endDate),
                AverageDonation = await _donationRepository.GetAverageDonationsAmountAsync(start: startDate, end: endDate),
                MinDonation = await _donationRepository.GetSmallestDonationAmountAsync(start: startDate, end: endDate),
                ModeDonation= await _donationRepository.GetMostFrequentUserDonationAsync(start: startDate, end: endDate),
                MostFrequentDonorStats = await _donationRepository.GetMostFrequentDonorInformationAsync(start: startDate, end: endDate),
            };
        }
        public byte[] GenerateExcelReport(ReportStats stats, DateTime startDate, DateTime endDate)
        {
            string templatePath = Path.Combine(
                AppContext.BaseDirectory,
                "Templates",
                "ExcelTemplates",
                "FoundationStatisticsTemplate.xlsx"
            );
            using var wb = new XLWorkbook(templatePath);
            var ws = wb.Worksheet(1);

            ws.Cell("B1").Value = $"Foundation report on period from {startDate.ToString(DateSettings.DEFAULT_DATE_FORMAT)} to {endDate.ToString(DateSettings.DEFAULT_DATE_FORMAT)}";

            ws.Cell("C5").Value = stats.DonationsCount;
            ws.Cell("C6").Value = stats.UsersCount;
            ws.Cell("C7").Value = stats.UniqueDonors;
            ws.Cell("C8").Value = stats.CampaignsCount;
            ws.Cell("C9").Value = stats.NewsUpdatesCount;
            ws.Cell("C10").Value = stats.TotalAmount;
            ws.Cell("C11").Value = stats.MaxDonation;
            ws.Cell("C12").Value = stats.AverageDonation;
            ws.Cell("C13").Value = stats.MinDonation;

            ws.Cell("C14").Value = stats.ModeDonation.Item1;
            ws.Cell("D14").Value = stats.ModeDonation.Item2.ToString();

            ws.Cell("C15").Value = stats.MostFrequentDonorStats.Item1;
            ws.Cell("C16").Value = stats.MostFrequentDonorStats.Item2;

            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
