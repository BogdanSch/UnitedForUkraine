using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using Stripe.Events;
using UnitedForUkraine.Server.Data.Enums;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Controllers
{
    [Route("api/payments/webhooks")]
    [ApiController]
    public class StripeWebhooksController : ControllerBase
    {
        private readonly IDonationRepository _donationRepository;
        private readonly ICampaignRepository _campaignRepository;
        private readonly ILogger<StripeWebhooksController> _logger;
        private readonly IConfiguration _config;

        public StripeWebhooksController(
            IDonationRepository donationRepository,
            ICampaignRepository campaignRepository,
            ILogger<StripeWebhooksController> logger,
            IConfiguration config)
        {
            _donationRepository = donationRepository;
            _campaignRepository = campaignRepository;
            _logger = logger;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Handle()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var secret = _config["Stripe:WebhookSecret"];
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], secret);

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;
                    var userId = session.ClientReferenceId;

                    var donation = await _donationRepository.GetDonationByCheckoutSessionId(session.Id);
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
                _logger.LogError(e, "Stripe webhook error");
                return BadRequest();
            }
        }
    }
}
