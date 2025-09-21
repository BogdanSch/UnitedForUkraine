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

export type UserDto = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  city: string;
  isAdmin: boolean;
};

export type UpdateUserProfileDto = {
  userName: string;
  phoneNumber: string;
  city: string;
};

export type Statistics = {
  donationsCount: number;
  totalDonationsAmount: number;
  mostFrequentDonationAmount: number;
  averageDonationsAmount: number;
  uniqueDonorsCount: number;
  cityWithMostDonations: string;
  mostFrequentDonorName: string;
  donationsGrowthRate: number;
};

export type UserStatistics = {
  donationsCount: number;
  totalDonationsAmount: number;
  averageDonationsAmount: number;
  smallestDonationAmount: number;
  biggestDonationAmount: number;
  supportedCampaignsCount: number;
  firstDonationDate: string;
  lastDonationDate: string;
};

export type TimelineItem = {
  date: string;
  description: string;
};

export type TokenDateDto = {
  // accessToken: string;
  // refreshToken: string;
  accessTokenExpirationTime: string;
  refreshTokenExpirationTime: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  messageDate: string;
};

export type NewsUpdateDto = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  readingTimeInMinutes: number;
  postedAt: string;
  authorName: string;
};

export type PaginatedNewsUpdatesDto = {
  newsUpdates: NewsUpdateDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CreateNewsUpdateRequestDto = {
  title: string;
  content: string;
  imageUrl: string;
  readingTimeInMinutes: number;
};
