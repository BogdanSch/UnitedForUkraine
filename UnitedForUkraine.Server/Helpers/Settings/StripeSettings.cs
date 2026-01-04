using UnitedForUkraine.Server.Data.Enums;

namespace UnitedForUkraine.Server.Helpers.Settings;

public class StripeSettings
{
    public const string DEFAULT_CURRENCY_NAME = "UAH";
    public static string GetCurrencyCode(CurrencyType currencyEnum) => Enum.GetName(currencyEnum)?.ToUpper() ?? DEFAULT_CURRENCY_NAME;
    public string SecretKey { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
}