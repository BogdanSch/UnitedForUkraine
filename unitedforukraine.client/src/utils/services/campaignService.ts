import axios from "axios";
import { API_URL } from "../../variables";
import { CampaignCategory, CampaignStatus } from "../../types/enums";
import { CampaignDto, PaginatedCampaignsDto, TimelineItem } from "../../types";

export const fetchAllCompletedCampaigns = async (
  page: number
): Promise<PaginatedCampaignsDto> => {
  try {
    const { data } = await axios.get<PaginatedCampaignsDto>(
      `${API_URL}/campaigns?page=${page}&filterName=finishedCampaign`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error))
      console.log("Error fetching campaigns:", error.message);
    else console.log("Unexpected error:", error);
  }

  return { campaigns: [], hasNextPage: false, hasPreviousPage: false };
};

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

export const getCampaignTimelines = (campaign: CampaignDto): TimelineItem[] => {
  if (!campaign) return [];

  let startDate: string = campaign ? campaign.startDate : "";
  let endDate: string = campaign ? campaign.endDate : "";

  return [
    {
      date: new Date(startDate).toLocaleDateString(),
      description: "Start date",
    },
    {
      date: new Date().toLocaleDateString(),
      description: "Current date",
    },
    { date: new Date(endDate).toLocaleDateString(), description: "End date" },
  ];
};

export const fetchCampaignData = async (
  id: number
): Promise<CampaignDto | null> => {
  const options = {
    method: "GET",
    url: `${API_URL}/campaigns/${id}`,
  };

  try {
    const { data } = await axios.request<CampaignDto>(options);

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
