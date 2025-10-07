using Newtonsoft.Json.Linq;
using System.Collections.Concurrent;
using System.Net;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Services
{
    public class CurrencyConverterService(HttpClient httpClient) : ICurrencyConverterService
    {
        public const int CACHE_DURATION_IN_HOURS = 1;

        private readonly HttpClient _httpClient = httpClient;
        private const string ApiUrl = "https://api.exchangerate-api.com/v4/latest/";
        private readonly ConcurrentDictionary<string, (ConcurrentDictionary<string, decimal> rates, DateTime lastCachedTime)> _cachedCurrencyRates = [];

        public async Task<decimal> GetCurrencyRate(string fromCurrency, string toCurrency)
        {
            if(_cachedCurrencyRates.TryGetValue(fromCurrency, out var cachedData) && (DateTime.UtcNow - cachedData.lastCachedTime).TotalHours < CACHE_DURATION_IN_HOURS)
            {
                if(cachedData.rates.TryGetValue(toCurrency, out var cachedRate))
                {
                    return cachedRate;
                }
            }

            HttpResponseMessage response = await _httpClient.GetAsync(ApiUrl + fromCurrency);

            if(!response.IsSuccessStatusCode)
            {
                throw new Exception("Error fetching currency rates from the API");
            }

            string json = await response.Content.ReadAsStringAsync();
            JObject data = JObject.Parse(json);

            Dictionary<string, decimal> rates = data["rates"]?.ToObject<Dictionary<string, decimal>>() ?? [];
            _cachedCurrencyRates[fromCurrency] = (new ConcurrentDictionary<string, decimal>(rates), DateTime.UtcNow);

            if (!rates.TryGetValue(toCurrency, out var rate))
                throw new Exception($"Currency rate {fromCurrency}->{toCurrency} not found.");

            return rate;
        }
        public async Task<decimal> ConvertCurrency(decimal amount, string fromCurrency, string toCurrency)
        {
            if (fromCurrency.Equals(toCurrency, StringComparison.OrdinalIgnoreCase))
                return amount;

            decimal rate = await GetCurrencyRate(fromCurrency, toCurrency);
            decimal convertedAmount = amount * rate;
            return convertedAmount;
        }
    }
}
