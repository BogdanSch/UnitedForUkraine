using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Models;

public class Donation
{
    [Key]
    public int Id { get; set; }
    [Precision(18, 2)]
    public required decimal Amount { get; set; }
    [Precision(18, 2)]
    public decimal? AmountInUah { get; set; }
    public CurrencyType Currency { get; set; }
    public required DateTime PaymentDate { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DonationStatus Status { get; set; } = DonationStatus.Pending;
    [StringLength(200, ErrorMessage = "Notes can't exceed 200 characters.")]
    public string? Notes { get; set; } = string.Empty;
    [ForeignKey(nameof(AppUser))]
    public string UserId { get; set; } = string.Empty;
    public AppUser User { get; set; } = null!;

    [ForeignKey(nameof(Campaign))]
    public int CampaignId { get; set; }
    public Campaign Campaign { get; set; } = null!;
    public string? CheckoutSessionId { get; set; } = string.Empty;
    public Receipt Receipt { get; set; } = null!;
}
