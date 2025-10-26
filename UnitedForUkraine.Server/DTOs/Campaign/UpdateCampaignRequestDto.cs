using System.ComponentModel.DataAnnotations;

namespace UnitedForUkraine.Server.DTOs.Campaign
{
    public class UpdateCampaignRequestDto
    {
        public int Id { get; set; }
        [MaxLength(255, ErrorMessage = "Title can't be over 265 over characters")]
        [MinLength(10, ErrorMessage = "Title can't be less than 10 characters")]
        public required string Title { get; set; }
        [MaxLength(60, ErrorMessage = "Slogan can't be over 60 over characters")]
        public required string Slogan { get; init; }
        [MinLength(20, ErrorMessage = "Description can't be less less than 20 characters")]
        public required string Description { get; set; }
        [Range(1, 10e18)]
        public decimal GoalAmount { get; set; }
        public int Status { get; set; }
        public required int Category { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
