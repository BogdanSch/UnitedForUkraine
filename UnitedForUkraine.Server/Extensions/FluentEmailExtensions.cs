namespace UnitedForUkraine.Server.Extensions;

public static class FluentEmailExtensions
{
    public static void AddFluentEmail(this IServiceCollection services, ConfigurationManager configuration)
    {
        IConfigurationSection emailSettings = configuration.GetSection("EmailSettings");

        string? defaultSender = emailSettings["DefaultSender"];
        string? defaultPassword = emailSettings["DefaultPassword"];

        string? smtpHost = emailSettings["SmtpHost"];
        int smtpPort = emailSettings.GetValue<int>("SmtpPort");

        services.AddFluentEmail(defaultSender)
            .AddSmtpSender(smtpHost, smtpPort, defaultSender, defaultPassword)
            .AddRazorRenderer();
    }
}
