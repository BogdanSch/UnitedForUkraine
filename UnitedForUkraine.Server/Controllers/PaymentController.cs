using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe.Checkout;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Stripe;

using CustomDonationMethod = UnitedForUkraine.Server.Data.Enums.PaymentMethod;
using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        //private readonly StripeSettings _stripeSettings;
        private readonly FrontendSettings _frontendSettings;
        private readonly UserManager<AppUser> _userManager;
        private readonly IDonationRepository _donationRepository;
        private readonly ICampaignRepository _campaignRepository;

        public PaymentController(IOptions<StripeSettings> stripeSettings, IOptions<FrontendSettings> frontendSettings, UserManager<AppUser> userManager, IDonationRepository donationRepository, ICampaignRepository campaignRepository)
        {
            //_stripeSettings = stripeSett?ings.Value;?
            _frontendSettings = frontendSettings.Value;
            _donationRepository = donationRepository;
            _campaignRepository = campaignRepository;
            _userManager = userManager;
        }
        private static List<string> GetStripePaymentMethod(CustomDonationMethod paymentMethod)
        {
            return paymentMethod switch
            {
                CustomDonationMethod.CreditCard => ["card"],
                CustomDonationMethod.PayPal => ["paypal"],// Not supported directly by Stripe Checkout
                CustomDonationMethod.BankTransfer => ["bancontact"],
                CustomDonationMethod.Crypto => ["bitcoin"],// Only available via special Stripe partners
                _ => ["card"],
            };
        }
        [Authorize]
        [HttpPost("create/{createdDonationId:int}")]
        public async Task<IActionResult> CreateCheckoutSession(int createdDonationId)
        {
            Donation? currentDonation = await _donationRepository.GetDonationById(createdDonationId);

            if (currentDonation == null)
                return BadRequest("Invalid donation data");

            Campaign? targetCampaign = await _campaignRepository.GetCampaignById(currentDonation.CampaignId);

            if(targetCampaign == null)
                return BadRequest("Invalid campaign data within the donation");

            AppUser? contributor = await _userManager.FindByIdAsync(currentDonation.UserId);

            if(contributor == null)
                return BadRequest("Invalid user data");

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
                            UnitAmount = Convert.ToInt64(currentDonation.Amount) * 100,
                            Currency = Enum.GetName(currentDonation.Currency)?.ToUpper() ?? "eur",
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

                targetCampaign.RaisedAmount += currentDonation.Amount;
                _campaignRepository.Update(targetCampaign);

                currentDonation.Status = DonationStatus.Completed;
                _donationRepository.Update(currentDonation);

                return Ok(new { redirectUrl = stripeCheckOutSession.Url.ToString() });
            }
            catch (StripeException e)
            {
                await _donationRepository.Delete(currentDonation.Id);
                _donationRepository.Save();
                return BadRequest(new { error = e.Message });
            }
        }
    }
}
