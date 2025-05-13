using Newtonsoft.Json.Linq;
using System.Net;
using UnitedForUkraine.Server.Interfaces;

namespace UnitedForUkraine.Server.Services
{
    public class CurrencyConverterService : ICurrencyConverterService
    {
        private readonly HttpClient _httpClient;
        private const string ApiUrl = "https://api.exchangerate-api.com/v4/latest/";
        public CurrencyConverterService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<decimal> GetCurrencyRate(string fromCurrency, string toCurrency)
        {
            HttpResponseMessage response = await _httpClient.GetAsync(ApiUrl + fromCurrency);

            if(response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception("Error fetching currency rates");
            }

            string json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);
            decimal rate = data["rates"]?[toCurrency]?.Value<decimal>() ?? 1m;

            return rate;
        }
        public async Task<decimal> ConvertCurrency(decimal amount, string fromCurrency, string toCurrency)
        {
            decimal rate = await GetCurrencyRate(fromCurrency, toCurrency);
            decimal convertedAmount = amount * rate;
            return convertedAmount;
        }
    }
}
