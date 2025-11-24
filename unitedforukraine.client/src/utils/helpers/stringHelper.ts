import { DEFAULT_PREVIEW_TEXT_LENGTH } from "../../variables";

export const convertToPreviewText = (
  text: string,
  maxLength: number = DEFAULT_PREVIEW_TEXT_LENGTH
): string => {
  return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
};

export const isNullOrWhitespace = (text: string): boolean => {
  return !text || text.trim().length < 1;
};
