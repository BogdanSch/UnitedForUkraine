import { Currency } from "../../types/enums";

export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "decimal",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const convertCurrencyToString = (currency: number): string => {
  for (const [key, value] of Object.entries(Currency)) {
    if (value === currency) return key.toString();
  }
  return "";
};

export const convertCurrencyToSymbol = (currency: Currency): string => {
  switch (currency) {
    case Currency.EUR:
      return "€";
    case Currency.USD:
      return "$";
    case Currency.UAH:
      return "₴";
    default:
      return "";
  }
};
