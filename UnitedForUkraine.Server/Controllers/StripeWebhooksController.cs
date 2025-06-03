using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers.Settings;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Controllers
{
    [Route("api/payments/webhooks")]
    [ApiController]
    public class StripeWebhooksController : ControllerBase
    {
        private readonly IDonationRepository _donationRepository;
        private readonly ICampaignRepository _campaignRepository;
        private readonly ICurrencyConverterService _currencyConverterService;
        private readonly ILogger<StripeWebhooksController> _logger;
        private readonly StripeSettings _stripeSettings;

        public StripeWebhooksController(
            IDonationRepository donationRepository,
            ICampaignRepository campaignRepository,
            ICurrencyConverterService currencyConverterService,
            ILogger<StripeWebhooksController> logger,
            IOptions<StripeSettings> stripeOptions)
        {
            _donationRepository = donationRepository;
            _campaignRepository = campaignRepository;
            _currencyConverterService = currencyConverterService;
            _logger = logger;
            _stripeSettings = stripeOptions.Value;
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> Handle()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                string secret = _stripeSettings.WebhookSecret;
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], secret);

                if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
                {
                    Session? session = stripeEvent.Data.Object as Session;

                    if (session == null)
                    {
                        _logger.LogError("Session is empty!");
                        return BadRequest();
                    }

                    string userId = session.ClientReferenceId;

                    Donation? donation = await _donationRepository.GetDonationByCheckoutSessionId(session.Id);
                    if (donation != null)
                    {
                        donation.Status = DonationStatus.Completed;
                        var campaign = await _campaignRepository.GetCampaignByIdAsync(donation.CampaignId);
                        if (campaign != null)
                        {
                            decimal convertedAmount = await
                                _currencyConverterService.ConvertCurrency(
                                    donation.Amount,
                                StripeSettings.GetCurrencyCode(donation.Currency),
                                StripeSettings.GetCurrencyCode(campaign.Currency)
                            );
                            campaign.RaisedAmount += convertedAmount;
                            await _campaignRepository.UpdateAsync(campaign);
                        }
                        await _donationRepository.UpdateAsync(donation);
                    }
                }
                return Ok();
            }
            catch (StripeException e)
            {
                _logger.LogError(e.StripeError.Message, "Stripe webhook error");
                return BadRequest();
            }
        }
    }
}
