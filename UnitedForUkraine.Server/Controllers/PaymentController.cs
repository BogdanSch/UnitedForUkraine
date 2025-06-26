using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Stripe;
using Stripe.Checkout;
using UnitedForUkraine.Server.Data.Enums;

using CustomDonationMethod = UnitedForUkraine.Server.Data.Enums.PaymentMethod;
using UnitedForUkraine.Server.Helpers.Settings;

namespace UnitedForUkraine.Server.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController(IOptions<FrontendSettings> frontendSettings, UserManager<AppUser> userManager, IDonationRepository donationRepository, ICampaignRepository campaignRepository, ICurrencyConverterService currencyConverterService) : ControllerBase
    {
        public const string DEFAULT_STRIPE_CURRENCY = "uah";
        private readonly FrontendSettings _frontendSettings = frontendSettings.Value;
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly IDonationRepository _donationRepository = donationRepository;
        private readonly ICampaignRepository _campaignRepository = campaignRepository;

        private static List<string> GetStripePaymentMethod(CustomDonationMethod paymentMethod)
        {
            return paymentMethod switch
            {
                CustomDonationMethod.CreditCard => ["card"],
                //CustomDonationMethod.BankTransfer => ["bancontact"],
                _ => ["card"],
            };
        }
        [HttpPost("{createdDonationId:int}")]
        [Authorize]
        public async Task<IActionResult> CreateCheckoutSession(int createdDonationId)
        {
            Donation? currentDonation = await _donationRepository.GetDonationByIdAsync(createdDonationId);

            if (currentDonation == null)
                return BadRequest(new { message = "Invalid donation data" });

            Campaign? targetCampaign = await _campaignRepository.GetCampaignByIdAsync(currentDonation.CampaignId);

            if (targetCampaign == null)
                return BadRequest(new { message = "Invalid campaign data within the donation" });

            if(targetCampaign.Status != CampaignStatus.Ongoing)
                return BadRequest(new { message = "Campaign is not active for donations" } );

            AppUser? contributor = await _userManager.FindByIdAsync(currentDonation.UserId);

            if(contributor == null)
                return BadRequest(new { message = "Invalid user data" });

            string requestOrigin = _frontendSettings.Origin;

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = GetStripePaymentMethod(currentDonation.PaymentMethod),
                LineItems =
                [
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = Convert.ToInt64(currentDonation.Amount * 100) ,
                            Currency = Enum.GetName(currentDonation.Currency)?.ToLower() ?? DEFAULT_STRIPE_CURRENCY,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = currentDonation.Campaign.Title,
                                Description = currentDonation.Campaign.Description,
                            },
                        },
                        Quantity = 1,
                    },
                ],
                Mode = "payment",
                ClientReferenceId = contributor.Id,
                SuccessUrl = $"{requestOrigin}/donate/confirmation",
                CancelUrl = $"{requestOrigin}/donate/failed",
                CustomerEmail = contributor.Email,                
            };

            try
            {
                SessionService stripeSessionService = new();
                Session stripeCheckOutSession = await stripeSessionService.CreateAsync(options);

                currentDonation.Status = DonationStatus.Pending;
                currentDonation.CheckoutSessionId = stripeCheckOutSession.Id;
                await _donationRepository.UpdateAsync(currentDonation);

                return Ok(new { redirectUrl = stripeCheckOutSession.Url.ToString() });
            }
            catch (StripeException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}
