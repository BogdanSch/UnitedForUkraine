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
                    if (stripeEvent.Data.Object is not Session session)
                    {
                        _logger.LogError("Session is empty!");
                        return BadRequest();
                    }

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
                    return Ok();
                }
                else if(stripeEvent.Type == EventTypes.CheckoutSessionAsyncPaymentFailed ||
                    stripeEvent.Type == EventTypes.CheckoutSessionExpired)
                {
                    if (stripeEvent.Data.Object is not Session session)
                    {
                        _logger.LogWarning("Stripe event '{EventType}' received, but session was null or invalid.", stripeEvent.Type);
                        return BadRequest();
                    }

                    Donation? donation = await _donationRepository.GetDonationByCheckoutSessionId(session.Id);

                    if (donation != null && donation.Status == DonationStatus.Pending)
                    {
                        await _donationRepository.DeleteAsync(donation.Id);
                    }
                    return Ok(new { message = "An error has occured during check-out!" });
                }

                return Ok(new { message = "Event processed successfully" });
            }
            catch (StripeException e)
            {
                _logger.LogError(e.StripeError.Message, "Stripe webhook error");
                return BadRequest();
            }
        }
    }
}
