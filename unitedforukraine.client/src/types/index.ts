export type Campaign = {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: CampaignStatus;
  currency: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type Donation = {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  campaignId: number;
};

export type CampaignStatus = "Ongoing" | "Completed" | "Upcoming" | "Cancelled";

export type User = {
  
};
