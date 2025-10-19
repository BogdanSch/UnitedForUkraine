using System.ComponentModel.DataAnnotations.Schema;

namespace UnitedForUkraine.Server.Models;

public class CampaignLike
{
    [ForeignKey(nameof(Campaign))]
    public required int LikedCampaignId { get; set; }
    public Campaign? LikedCampaign { get; set; }

    [ForeignKey(nameof(AppUser))]
    public required string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
}