import { UNDEFINED_DATE } from "../variables";

const options: Record<string, string> = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const convertDate = (dateString: string): string => {
  if (dateString.length === 0) {
    return UNDEFINED_DATE;
  }
  return new Date(dateString).toISOString().slice(0, 10);
};

export const convertToReadableDate = (dateString: string): string => {
  if (dateString.length === 0) {
    return UNDEFINED_DATE;
  }
  return new Date(dateString).toLocaleDateString("en-US", options);
};
