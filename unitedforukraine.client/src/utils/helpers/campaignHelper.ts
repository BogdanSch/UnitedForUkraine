import axios from "axios";
import { API_URL } from "../../variables";
import { CampaignCategory, CampaignStatus } from "../../types/enums";

export const convertCampaignStatusToString = (status: number): string => {
  for (const [key, value] of Object.entries(CampaignStatus)) {
    if (value === status) return key.toString().toLocaleLowerCase();
  }
  return "";
};

export const convertCampaignCategoryToString = (category: number): string => {
  for (const [key, value] of Object.entries(CampaignCategory)) {
    if (value === category) return key.toString();
  }
  return "";
};

export const fetchCampaignData = async (id: number) => {
  const options = {
    method: "GET",
    url: `${API_URL}/campaigns/${id}`,
  };

  try {
    const { data } = await axios.request(options);

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
