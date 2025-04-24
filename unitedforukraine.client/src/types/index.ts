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

export type UpdateCampaignRequestDto = {
  title: string;
  description: string;
  goalAmount: number;
  // raisedAmount: number;
  status: CampaignStatus;
  // currency: Currency;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
};

export type DonationDto = {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  currency: number;
  paymentDate: string;
  paymentMethod: string;
  status: number;
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

export type Address = {
  id: number;
  street: string;
  city: string;
  country: string;
};

export type UserDto = {
  id: string;
  userName: string;
  email: string;
  address: Address;
  phoneNumber?: string;
  isAdmin: boolean;
};

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
