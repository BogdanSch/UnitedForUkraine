using ClosedXML.Excel;
using UnitedForUkraine.Server.Data;
using UnitedForUkraine.Server.Helpers;
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
        public byte[] GenerateExcelReport(ReportStats stats)
        {
            using var wb = new XLWorkbook();
            var ws = wb.AddWorksheet("Foundation Report");

            ws.Cell("A1").Value = "Indicator";
            ws.Cell("B1").Value = "Value";

            ws.Cell("A2").Value = "Total donations number";
            ws.Cell("B2").Value = stats.DonationsCount;

            ws.Cell("A3").Value = "Number of registered users";
            ws.Cell("B3").Value = stats.UsersCount;

            ws.Cell("A4").Value = "Uniquer donors number";
            ws.Cell("B4").Value = stats.UniqueDonors;

            ws.Cell("A5").Value = "Campaigns number";
            ws.Cell("B5").Value = stats.CampaignsCount;

            ws.Cell("A6").Value = "News updates number";
            ws.Cell("B6").Value = stats.NewsUpdatesCount;

            ws.Cell("A7").Value = "Total donations amount";
            ws.Cell("B7").Value = stats.TotalAmount;

            ws.Cell("A8").Value = "Max donation amount";
            ws.Cell("B8").Value = stats.MaxDonation;

            ws.Cell("A9").Value = "Average donation amount";
            ws.Cell("B9").Value = stats.AverageDonation;

            ws.Cell("A10").Value = "Min donation amount";
            ws.Cell("B10").Value = stats.MinDonation;

            ws.Cell("A11").Value = "Mode (the most frequent amount)";
            ws.Cell("B11").Value = stats.ModeDonation.Item1;
            ws.Cell("C11").Value = stats.ModeDonation.Item2.ToString();

            ws.Cell("A12").Value = "The best donor name";
            ws.Cell("B12").Value = stats.MostFrequentDonorStats.Item1;
            ws.Cell("A13").Value = "The best donor donations number";
            ws.Cell("B13").Value = stats.MostFrequentDonorStats.Item2;

            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
