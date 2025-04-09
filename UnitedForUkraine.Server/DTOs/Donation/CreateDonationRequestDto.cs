using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class CreateDonationRequestDto
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;

        [DataType(DataType.Currency)]
        public decimal Amount { get; set; }
        public int Currency { get; set; }
        public int PaymentMethod { get; set; }
        public int Status { get; set; }
        public string PaymentDate { get; set; } = string.Empty;
        public int CampaignId { get; set; }
    }
}
