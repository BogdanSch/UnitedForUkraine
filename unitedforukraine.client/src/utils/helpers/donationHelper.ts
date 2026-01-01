import { Currency, DonationStatus } from "../../types/enums";

export const convertDonationCurrencyToString = (currency: number): string => {
  for (const [key, value] of Object.entries(Currency)) {
    if (value === currency) return key.toString().toLocaleUpperCase();
  }
  return "";
};

export const convertDonationStatusToString = (currency: number): string => {
  for (const [key, value] of Object.entries(DonationStatus)) {
    if (value === currency) return key.toString().toLocaleUpperCase();
  }
  return "";
};
