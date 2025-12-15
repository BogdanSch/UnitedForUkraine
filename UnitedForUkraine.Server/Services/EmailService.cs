using FluentEmail.Core;
using UnitedForUkraine.Server.Helpers;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Services
{
    public class EmailService(IFluentEmail fluentEmail) : IEmailService
    {
        private readonly string templatesPath = Path.Combine(
                AppContext.BaseDirectory,
                "Templates",
                "EmailTemplates"
            );
        private readonly IFluentEmail _fluentEmail = fluentEmail;
        public async Task SendAsync(EmailMetadata emailMetadata)
        {
            await _fluentEmail.To(emailMetadata.ToAddress)
                .Subject(emailMetadata.Subject)
                .Body(emailMetadata.Body)
                .SendAsync();
        }
        public async Task SendEmailConfirmationAsync(EmailMetadata emailMetadata, string callback)
        {
            string templatePath = Path.Combine(
                templatesPath,
                "EmailConfirmationMessage.cshtml"
            );
            await _fluentEmail.To(emailMetadata.ToAddress)
                .Subject(emailMetadata.Subject)
                .UsingTemplateFromFile(templatePath, callback)
                .SendAsync();
        }
        public async Task SendReceiptAsync(EmailMetadata emailMetadata, string recipientName)
        {
            string templatePath = Path.Combine(
                templatesPath,
                "ReceiptMessage.cshtml"
            );
            await _fluentEmail.To(emailMetadata.ToAddress)
                .Subject(emailMetadata.Subject)
                .UsingTemplateFromFile(templatePath, recipientName)
                .Attach(emailMetadata.Attachments ?? [])
                .SendAsync();
        }
    }
}
