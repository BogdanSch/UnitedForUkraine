import { Currency } from "../types";

export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("en-GB").format(amount);
};

export const convertCurrencyToString = (currency: number): string => {
  for (const [key, value] of Object.entries(Currency)) {
    if (value === currency) return key.toString();
  }
  return "";
};
