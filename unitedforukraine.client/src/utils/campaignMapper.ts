import { CampaignStatus } from "../types";

export const convertCampaignStatusToString = (status: number): string => {
  for (const [key, value] of Object.entries(CampaignStatus)) {
    if (value === status) return key.toString();
  }
  return "";
};
