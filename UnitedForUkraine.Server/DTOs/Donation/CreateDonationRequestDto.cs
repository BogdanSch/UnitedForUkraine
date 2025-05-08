using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class CreateDonationRequestDto
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;

        [DataType(DataType.Currency)]
        [Range(1, 10e18)]
        public decimal Amount { get; set; }
        public int Currency { get; set; }
        public int PaymentMethod { get; set; }
        //public int Status { get; set; }
        public required string PaymentDate { get; set; } = string.Empty;
        public required int CampaignId { get; set; }
    }
}
