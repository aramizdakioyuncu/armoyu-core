export interface GroupDTO {
  id: number;
  name: string;
  displayName?: string;
  shortName?: string;
  slug?: string;
  description?: string;
  category?: string;
  tag?: string;
  logo?: string;
  banner?: string;
  wallpaper?: string;
  recruitmentStatus?: string | number;
  date?: string;
  registrationDate?: string;
  memberCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  founder?: string;
  role?: string;
  url?: string;
  socials?: {
    discord?: string;
    website?: string;
  };
}
