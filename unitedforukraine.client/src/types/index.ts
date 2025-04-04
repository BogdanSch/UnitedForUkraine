export type CampaignDto = {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: CampaignStatus;
  currency: Currency;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type CreateCampaignRequestDto = {
  title: string;
  description: string;
  goalAmount: number;
  // raisedAmount: number;
  status: CampaignStatus;
  currency: Currency;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type DonationDto = {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  campaignId: number;
};

export enum CampaignStatus {
  Upcoming,
  Ongoing,
  Completed,
  Cancelled,
}

export enum Currency {
  USD,
  EUR,
  UAH,
}

export type UserDto = {};

export type Statistics = {
  donationsCount: number;
  totalDonationsAmount: number;
  averageDonationsAmount: number;
  uniqueDonorsCount: number;
};

export type TimelineItem = {
  date: string;
  description: string;
};
