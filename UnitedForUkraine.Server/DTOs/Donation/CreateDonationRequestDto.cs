using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class CreateDonationRequestDto
    {
        [MinLength(2)]
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;

        [DataType(DataType.Currency)]
        [Range(1, 10e12)]
        public decimal Amount { get; set; }
        public int Currency { get; set; }
        public int PaymentMethod { get; set; }
        //public int Status { get; set; }
        public required int CampaignId { get; set; }
    }
}
