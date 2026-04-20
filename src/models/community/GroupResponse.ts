import { UserResponse } from '../auth/UserResponse';

export interface GroupMediaResponse {
  media_ID?: number;
  media_URL?: string;
  media_bigURL?: string;
  media_minURL?: string;
}

export interface GroupResponse {
  id: string | number;
  name: string;
  displayName?: string;
  shortName?: string;
  slug?: string;
  description?: string;
  category?: string;
  tag?: string;
  logo?: string | GroupMediaResponse;
  banner?: string | GroupMediaResponse;
  wallpaper?: string | GroupMediaResponse;
  recruitmentStatus?: string | number;
  date?: string;
  registrationDate?: string;
  memberCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  owner?: UserResponse;
  founder?: string;
  role?: string;
  moderators?: UserResponse[];
  members?: UserResponse[];
  url?: string;
  socials?: {
    discord?: string;
    website?: string;
  };
}
