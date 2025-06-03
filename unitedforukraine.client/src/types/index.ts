import {
  CampaignCategory,
  CampaignStatus,
  Currency,
  PaymentMethod,
} from "./enums";

export type CampaignDto = {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: CampaignStatus;
  currency: Currency;
  category: CampaignCategory;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type CreateCampaignRequestDto = {
  title: string;
  description: string;
  goalAmount: number;
  status: CampaignStatus;
  category: CampaignCategory;
  currency: Currency;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type UpdateCampaignRequestDto = {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  status: CampaignStatus;
  category: CampaignCategory;
  startDate: string;
  endDate: string;
  imageUrl: string;
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

export type CreateDonationRequestDto = {
  userId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  campaignId: number;
};

export type ImageDto = {
  path: string;
  alt: string;
  title?: string;
  description?: string;
};

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
  phoneNumber: string;
  isAdmin: boolean;
};

export type Statistics = {
  donationsCount: number;
  totalDonationsAmount: number;
  averageDonationsAmount: number;
  uniqueDonorsCount: number;
};

export type UserStatistics = {
  donationsCount: number;
  totalDonationsAmount: number;
  averageDonationsAmount: number;
  supportedCampaignsCount: number;
};

export type TimelineItem = {
  date: string;
  description: string;
};
