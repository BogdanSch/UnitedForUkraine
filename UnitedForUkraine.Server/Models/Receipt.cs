using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Models;

public class Receipt
{
    [Key]
    public int Id { get; set; }
    public required int ReceiptNumber { get; set; }
    public CurrencyType Currency { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public required DateTime IssuedAt { get; set; }
    public required string IssuerName { get; set; }
    [ForeignKey(nameof(Donation))]
    public required int DonationId { get; set; }
    public Donation? Donation { get; set; }
}