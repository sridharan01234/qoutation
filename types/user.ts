export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  company?: string;
  jobTitle?: string;
  department?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  language: string;
  timezone: string;
  currency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  role: string;
  isActive: boolean;
}
