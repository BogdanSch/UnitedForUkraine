﻿using Microsoft.AspNetCore.Mvc;
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
    public class StripeWebhooksController(
        IDonationRepository donationRepository,
        ICampaignRepository campaignRepository,
        ICurrencyConverterService currencyConverterService,
        IOptions<StripeSettings> stripeOptions,
        ILogger<StripeWebhooksController> logger) : ControllerBase
    {
        private readonly IDonationRepository _donationRepository = donationRepository;
        private readonly ICampaignRepository _campaignRepository = campaignRepository;
        private readonly ICurrencyConverterService _currencyConverterService = currencyConverterService;
        private readonly StripeSettings _stripeSettings = stripeOptions.Value;
        private readonly ILogger<StripeWebhooksController> _logger = logger;

        [HttpPost("webhook")]
        public async Task<IActionResult> HandleTransaction()
        {
            string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                string secret = _stripeSettings.WebhookSecret;
                Event stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], secret);

                if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
                {
                    if (stripeEvent.Data.Object is not Session session)
                    {
                        _logger.LogError("Session is empty!");
                        return BadRequest();
                    }

                    Donation? donation = await _donationRepository.GetDonationByCheckoutSessionId(session.Id);

                    if (donation is not null)
                    {
                        donation.Status = DonationStatus.Completed;
                        Campaign? campaign = await _campaignRepository.GetByIdAsync(donation.CampaignId);
                        if (campaign is not null)
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
                        string errorMessage = "Stripe event '{EventType}' received, but session was null or invalid";
                        _logger.LogWarning(errorMessage, stripeEvent.Type);
                        return BadRequest(new { message = errorMessage });
                    }

                    Donation? donation = await _donationRepository.GetDonationByCheckoutSessionId(session.Id);

                    if (donation is not null && donation.Status == DonationStatus.Pending)
                    {
                        await _donationRepository.DeleteAsync(donation.Id);
                    }
                    return BadRequest(new { message = "An error has occured during check-out" });
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
