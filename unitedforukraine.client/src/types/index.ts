import {
  CampaignCategory,
  CampaignStatus,
  Currency,
  DonationStatus,
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
  isLiked: boolean;
};

export type PaginatedCampaignsDto = {
  campaigns: CampaignDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CreateCampaignRequestDto = Omit<
  CampaignDto,
  "id" | "raisedAmount" | "donorsCount" | "isLiked"
>;

export type UpdateCampaignRequestDto = Omit<
  CampaignDto,
  "raisedAmount" | "donorsCount" | "isLiked" | "currency"
>;

export type DonationModeDto = {
  amount: number;
  currency: number;
};

export type DonationDto = {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  notes: string;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  paymentDate: string;
  campaignId: number;
};

export type PaginatedDonationsDto = {
  donations: DonationDto[];
  hasNextPage: boolean;
};

export type CreateDonationRequestDto = Omit<
  DonationDto,
  "id" | "userName" | "status" | "paymentDate"
>;

export type ImageDto = {
  path: string;
  alt: string;
  title?: string;
  description?: string;
};

export type AddressDto = {
  id: number;
  country: string;
  region: string;
  city: string;
  street: string;
  postalCode: string;
};
export type UpdateAddressRequestDto = Omit<AddressDto, "id">;

export type UserDto = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: AddressDto;
  registeredAt: string;
  isAdmin: boolean;
};

export type PaginatedUsersDto = {
  users: UserDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type RegisterUserDto = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  confirmEmailClientUri: string;
};

export type UpdateUserProfileDto = {
  userName: string;
  phoneNumber: string;
  updatedAddress: UpdateAddressRequestDto;
};

export type DeleteUserDto = {
  confirmEmail: string;
  password?: string;
};

export type Statistics = {
  donationsCount: number;
  campaignsCount: number;
  totalDonationsAmount: number;
  mostFrequentDonation: DonationModeDto;
  biggestDonationAmount: number;
  averageDonationsAmount: number;
  smallestDonationAmount: number;
  uniqueDonorsCount: number;
  cityWithMostDonations: string;
  countryWithMostDonations: string;
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

export type CampaignStatistics = {
  newsUpdatesCount: number;
  donationsCount: number;
  repeatDonorRate: number;
  likesCount: number;
};

export type TimelineItem = {
  date: Date;
  description: string;
};

export type TokenDateDto = {
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
  preview: string;
  content: string;
  imageUrl: string;
  readingTimeInMinutes: number;
  postedAt: string;
  authorName: string;
  viewsCount: number;
  targetCampaign: CampaignDto;
};

export type PaginatedNewsUpdatesDto = {
  newsUpdates: NewsUpdateDto[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CreateNewsUpdateRequestDto = Omit<
  NewsUpdateDto,
  "id" | "authorName" | "postedAt" | "viewsCount" | "targetCampaign"
> & {
  authorId: string;
  campaignId: number;
};

export type UpdateNewsUpdateRequestDto = Omit<
  NewsUpdateDto,
  "postedAt" | "authorName" | "viewsCount" | "targetCampaign"
>;

export type DateRange = {
  startDate: string;
  endDate: string;
};
