using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe.Checkout;
using Stripe;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.DTOs.Donation;
using UnitedForUkraine.Server.Mappers;
using UnitedForUkraine.Server.Models;
using UnitedForUkraine.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace UnitedForUkraine.Server.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly StripeSettings _stripeSettings;
        private readonly IDonationRepository _donationRepository;
        private readonly UserManager<AppUser> _userManager;

        public PaymentController(IOptions<StripeSettings> stripeSettings, IDonationRepository donationRepository, UserManager<AppUser> userManager)
        {
            _stripeSettings = stripeSettings.Value;
            _donationRepository = donationRepository;
            _userManager = userManager;
        }
        [Authorize]
        [HttpPost("create/{id:int}")]
        public async Task<IActionResult> CreateCheckoutSession([FromQuery] int createdDonationId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Donation? currentDonation = await _donationRepository.GetDonationById(createdDonationId);

            if (currentDonation == null)
                return BadRequest("Invalid donation data");

            //await _donationRepository.AddAsync(currentDonation);
            //_donationRepository.Save();

            AppUser? contributor = await _userManager.FindByIdAsync(currentDonation.UserId);

            if(contributor == null)
                return BadRequest("Invalid user data");

            var origin = $"{Request.Scheme}://{Request.Host}";

            var options = new SessionCreateOptions
            {
                //PaymentMethodTypes = new List<string> { "card" },
                LineItems =
                [
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = Convert.ToInt64(currentDonation.Amount),
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
                SuccessUrl = $"{origin}/payment/confirmation",
                CancelUrl = $"{origin}/payment/failed",
                CustomerEmail = contributor.Email,
            };

            try
            {
                SessionService stripeSessionService = new();
                Session stripeCheckOutSession = await stripeSessionService.CreateAsync(options);

                return Ok(new { redirectUrl = stripeCheckOutSession.Url.ToString() });
            }
            catch (StripeException e)
            {
                return BadRequest(new { error = e.Message });
            }
        }
    }
}
