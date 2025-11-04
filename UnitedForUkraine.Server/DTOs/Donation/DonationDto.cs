using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class DonationDto
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public string UserName { get; set; } = string.Empty;

        [DataType(DataType.Currency)]
        public decimal Amount { get; set; }
        public string Notes { get; set; } = string.Empty;
        public int Currency { get; set; }
        public int PaymentMethod { get; set; }
        public int Status { get; set; }
        public string PaymentDate { get; set; } = string.Empty;
        public required int CampaignId { get; set; }
        public string CheckoutSessionId { get; set; } = string.Empty;
    }
}
