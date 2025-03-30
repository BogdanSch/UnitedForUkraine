using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Mappers
{
    public static class DonationMappers
    {
        public static DonationDto ToDonationDto(this Donation donation)
        {
            return new DonationDto
            {
                Id = donation.Id,
                UserId = donation.UserId,
                CampaignId = donation.CampaignId,
                UserName = donation.User.UserName!,
                Amount = donation.Amount,
                Currency = Enum.GetName(donation.Currency)!,
                PaymentMethod = Enum.GetName(donation.PaymentMethod)!,
                Status = Enum.GetName(donation.Status)!,
                PaymentDate = donation.PaymentDate.ToString(DateSettings.DEFAULT_DATE_FORMAT)
            };
        }
    }
}
