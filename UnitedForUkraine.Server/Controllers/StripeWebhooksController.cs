using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using Stripe.Events;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Helpers;
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
        private readonly ILogger<StripeWebhooksController> _logger;
        //private readonly IConfiguration _config;
        private readonly StripeSettings _stripeSettings;

        public StripeWebhooksController(
            IDonationRepository donationRepository,
            ICampaignRepository campaignRepository,
            ILogger<StripeWebhooksController> logger,
            IOptions<StripeSettings> stripeOptions)
        {
            _donationRepository = donationRepository;
            _campaignRepository = campaignRepository;
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
                        _logger.LogError("Session is null");
                        return BadRequest();
                    }

                    string userId = session.ClientReferenceId;

                    Donation? donation = await _donationRepository.GetDonationByCheckoutSessionId(session.Id);
                    if (donation != null)
                    {
                        donation.Status = DonationStatus.Completed;
                        var campaign = await _campaignRepository.GetCampaignById(donation.CampaignId);
                        if (campaign != null)
                        {
                            campaign.RaisedAmount += donation.Amount;
                            _campaignRepository.Update(campaign);
                        }
                        _donationRepository.Update(donation);
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
