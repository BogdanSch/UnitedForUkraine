using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Stripe;
using Stripe.Checkout;
using UnitedForUkraine.Server.Data.Enums;

using CustomDonationMethod = UnitedForUkraine.Server.Data.Enums.PaymentMethod;

namespace UnitedForUkraine.Server.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        public const string DEFAULT_STRIPE_CURRENCY = "uah";
        private readonly FrontendSettings _frontendSettings;
        private readonly UserManager<AppUser> _userManager;
        private readonly IDonationRepository _donationRepository;
        private readonly ICampaignRepository _campaignRepository;
        private readonly ICurrencyConverterService _currencyConverterService;

        public PaymentController(IOptions<FrontendSettings> frontendSettings, UserManager<AppUser> userManager, IDonationRepository donationRepository, ICampaignRepository campaignRepository, ICurrencyConverterService currencyConverterService)
        {
            _frontendSettings = frontendSettings.Value;
            _donationRepository = donationRepository;
            _campaignRepository = campaignRepository;
            _userManager = userManager;
            _currencyConverterService = currencyConverterService;
        }
        private static List<string> GetStripePaymentMethod(CustomDonationMethod paymentMethod)
        {
            return paymentMethod switch
            {
                CustomDonationMethod.CreditCard => ["card"],
                //CustomDonationMethod.PayPal => ["paypal"],// Not supported directly by Stripe Checkout
                CustomDonationMethod.BankTransfer => ["bancontact"],
                //CustomDonationMethod.Crypto => ["bitcoin"],// Only available via special Stripe partners
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

                //stripeCheckOutSession.Id
                //stripeCheckOutSession.Conf.s\
                //Stripe.COnfirmCards

                //targetCampaign.RaisedAmount += convertedAmount;
                //_campaignRepository.Update(targetCampaign);

                currentDonation.Status = DonationStatus.Pending;
                currentDonation.CheckoutSessionId = stripeCheckOutSession.Id;
                _donationRepository.Update(currentDonation);

                return Ok(new { redirectUrl = stripeCheckOutSession.Url.ToString() });
            }
            catch (StripeException e)
            {
                //targetCampaign.RaisedAmount -= convertedAmount;
                //_campaignRepository.Update(targetCampaign);

                //await _donationRepository.Delete(currentDonation.Id);
                //_donationRepository.Save();

                return BadRequest(new { error = e.Message });
            }
        }
    }
}
