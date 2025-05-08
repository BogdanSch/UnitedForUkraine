using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.DTOs.Campaign;
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
                Currency = (int)donation.Currency,
                PaymentMethod = (int)donation.PaymentMethod,
                Status = (int)donation.Status,
                PaymentDate = donation.PaymentDate.ToString(DateSettings.DEFAULT_DATE_FORMAT)
            };
        }
        public static Donation FromCreateDonationDtoToDonation(this CreateDonationRequestDto newDonation)
        {
            return new Donation
            {
                UserId = newDonation.UserId,
                CampaignId = newDonation.CampaignId,
                Amount = newDonation.Amount,
                Currency = (CurrencyType)newDonation.Currency,
                PaymentMethod = (PaymentMethod)newDonation.PaymentMethod,
                Status = DonationStatus.Pending,
                PaymentDate = DateSettings.ParseDate(newDonation.PaymentDate)
            };
        }
    }
}