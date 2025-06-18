using FluentEmail.Core;
using UnitedForUkraine.Server.Interfaces;
using UnitedForUkraine.Server.Models;

namespace UnitedForUkraine.Server.Services
{
    public class EmailService(IFluentEmail fluentEmail) : IEmailService
    {
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
            string templatePath = $"{Directory.GetCurrentDirectory()}/EmailTemplates/EmailConfirmationMessage.cshtml";

            await _fluentEmail.To(emailMetadata.ToAddress)
                .Subject(emailMetadata.Subject)
                .UsingTemplateFromFile(templatePath, callback)
                .SendAsync();
        }
    }
}
