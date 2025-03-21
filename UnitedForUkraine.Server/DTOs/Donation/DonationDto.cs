using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Donation
{
    public class DonationDto
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public required string UserName { get; set; }

        [DataType(DataType.Currency)]
        public decimal Amount { get; set; }
        public required string Currency { get; set; }
        public required string PaymentMethod { get; set; }
        public required string Status { get; set; }
        public required string PaymentDate { get; set; }
        public int CampaignId { get; set; }
    }
}
