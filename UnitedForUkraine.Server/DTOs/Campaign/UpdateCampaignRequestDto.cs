using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class UpdateCampaignRequestDto
    {
        public int Id { get; set; }
        [MaxLength(265, ErrorMessage = "Title can't be over 265 over characters")]
        [MinLength(10, ErrorMessage = "Title can't be less 10 over characters")]
        public required string Title { get; set; }
        [MinLength(10, ErrorMessage = "Description can't be less 10 over characters")]
        public required string Description { get; set; }
        public string? ImageUrl { get; set; } = string.Empty;
        [Range(1, 10e18)]
        public decimal GoalAmount { get; set; }
        [Range(1, 10e18)]
        public decimal RaisedAmount { get; set; }
        public int Status { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
    }
}
