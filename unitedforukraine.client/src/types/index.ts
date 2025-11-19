import {
  CampaignCategory,
  CampaignStatus,
  Currency,
  PaymentMethod,
} from "./enums";

export type CampaignDto = {
  id: number;
  title: string;
  slogan: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  status: CampaignStatus;
  currency: Currency;
  category: CampaignCategory;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type PaginatedCampaignsDto = {
  campaigns: CampaignDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CreateCampaignRequestDto = {
  title: string;
  slogan: string;
  description: string;
  goalAmount: number;
  status: CampaignStatus;
  currency: Currency;
  category: CampaignCategory;
  startDate: string;
  endDate: string;
  imageUrl: string;
};

export type UpdateCampaignRequestDto = {
  id: number;
  title: string;
  slogan: string;
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
  notes: string;
  currency: number;
  paymentMethod: string;
  status: number;
  paymentDate: string;
  campaignId: number;
};

export type CreateDonationRequestDto = {
  userId: string;
  campaignId: number;
  amount: number;
  notes: string;
  currency: Currency;
  paymentMethod: PaymentMethod;
};

export type ImageDto = {
  path: string;
  alt: string;
  title?: string;
  description?: string;
};

export interface AddressDto {
  id: number;
  country: string;
  region: string;
  city: string;
  street: string;
  postalCode: string;
}
export interface UpdateAddressRequestDto {
  country: string;
  region: string;
  city: string;
  street: string;
  postalCode: string;
}

export type UserDto = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: AddressDto;
  registeredAt: string;
  isAdmin: boolean;
};

export type RegisterUserDto = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  confirmEmailClientUri: string;
};

export type PaginatedUsersDto = {
  users: UserDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type UpdateUserProfileDto = {
  userName: string;
  phoneNumber: string;
  updatedAddress: UpdateAddressRequestDto;
};

export type Statistics = {
  donationsCount: number;
  campaignsCount: number;
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
  keyWords: string;
  content: string;
  imageUrl: string;
  readingTimeInMinutes: number;
  postedAt: string;
  authorName: string;
  targetCampaign: CampaignDto;
};

export type PaginatedNewsUpdatesDto = {
  newsUpdates: NewsUpdateDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CreateNewsUpdateRequestDto = {
  title: string;
  keyWords: string;
  content: string;
  imageUrl: string;
  readingTimeInMinutes: number;
  authorId: string;
  campaignId: number;
};

// export type UpdateNewsUpdateRequestDto = {
//   title: string;
//   keyWords: string;
//   content: string;
//   imageUrl: string;
//   readingTimeInMinutes: number;
//   authorId: string;
//   campaignId: number;
// };
