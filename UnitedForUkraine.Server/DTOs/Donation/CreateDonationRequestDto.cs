using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Donation
{
    public record CreateDonationRequestDto
    {
        public required string UserId { get; init; }
        public required int CampaignId { get; init; }

        [DataType(DataType.Currency)]
        [Range(1, 10e12)]
        public decimal Amount { get; init; }
        [DataType(DataType.Text)]
        public string Notes { get; init; } = string.Empty;
        public required int Currency { get; init; }
        public required int PaymentMethod { get; init; }
    }
}
