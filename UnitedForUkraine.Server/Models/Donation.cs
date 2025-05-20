using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Models;

public class Donation
{
    [Key]
    public int Id { get; set; }

    [ForeignKey(nameof(AppUser))]
    public string UserId { get; set; } = string.Empty;
    public AppUser User { get; set; }

    [Precision(18, 2)]
    public decimal Amount { get; set; }
    public CurrencyType Currency { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DonationStatus Status { get; set; } = DonationStatus.Pending;

    [ForeignKey(nameof(Campaign))]
    public int CampaignId { get; set; }
    public Campaign Campaign { get; set; }
    public string? CheckoutSessionId { get; set; } = string.Empty;
}
