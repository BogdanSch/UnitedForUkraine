import { Currency } from "../types/enums";

export const convertDonationCurrencyToString = (currency: number): string => {
  for (const [key, value] of Object.entries(Currency)) {
    if (value === currency) return key.toString().toLocaleUpperCase();
  }
  return "";
};
