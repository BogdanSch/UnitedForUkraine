using UnitedForUkraine.Server.Helpers;

namespace UnitedForUkraine.Server.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(EmailMetadata emailMetadata);
        Task SendEmailConfirmationAsync(EmailMetadata emailMetadata, string callback);
    }
}
