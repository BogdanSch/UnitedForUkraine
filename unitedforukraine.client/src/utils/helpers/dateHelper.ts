import { UNDEFINED_DATE } from "../../variables";

const options: Record<string, string> = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const UTC_SUFFIX: string = "Z";

export const convertDate = (dateString: string): string => {
  if (dateString.length === 0) {
    return UNDEFINED_DATE;
  }
  return new Date(dateString).toISOString().slice(0, 10);
};

export const convertToReadableDate = (value: Date | string): string => {
  if (!value) return UNDEFINED_DATE;

  let date: Date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", options);
};

export const convertToUTCDate = (dateString: string): string => {
  if (dateString.length === 0) {
    return UNDEFINED_DATE;
  }
  return dateString + UTC_SUFFIX;
};
