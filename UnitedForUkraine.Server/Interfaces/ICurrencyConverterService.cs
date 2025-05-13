﻿namespace UnitedForUkraine.Server.Interfaces
{
    public interface ICurrencyConverterService
    {
        public Task<decimal> GetCurrencyRate(string fromCurrency, string toCurrency);
        public Task<decimal> ConvertCurrency(decimal amount, string fromCurrency, string toCurrency);
    }
}
