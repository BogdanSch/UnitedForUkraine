
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Services
{
    public class CampaignBackgroundService(IServiceScopeFactory serviceScopeFactory) : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _serviceScopeFactory.CreateScope();
                ICampaignRepository _campaignRepository = scope.ServiceProvider.GetRequiredService<ICampaignRepository>();

                await _campaignRepository.UpdateExpiredCampaignsAsync();
                await Task.Delay(TimeSpan.FromHours(2), stoppingToken);
            }
        }
    }
}
