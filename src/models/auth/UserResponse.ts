import { GroupResponse } from '../community/GroupResponse';
import { GameResponse } from '../content/GameResponse';
import { TeamResponse } from '../community/TeamResponse';

export interface UserMediaResponse {
  media_ID?: number;
  media_URL?: string;
  media_bigURL?: string;
  media_minURL?: string;
}

export interface UserResponse {
  // Common IDs
  id?: number;
  username?: string;
  
  // Basic Info
  firstName?: string;
  lastName?: string;
  displayName?: string;
  tag?: string;
  role?: string;
  about?: string;
  email?: string;
  isSocial?: boolean;
  
  // Avatar & Media
  avatar?: string;
  avatarSmall?: string;
  avatarThumbnail?: string;
  banner?: string;
  wallpaper?: string;
  
  // Status & Verification
  isOnline?: boolean;
  isFriend?: boolean;
  registrationDate?: string;
  lastLoginDate?: string;
  
  // Profile specific info
  gender?: string;
  birthday?: string;
  socials?: Record<string, string>;
  city?: string;
  country?: string;
  jobTitle?: string;
  zodiac?: string;
  
  // Leveling & Stats
  level?: number;
  xp?: number;
  xpNext?: number;
  rank?: string;
  rankImage?: string;
  rankColor?: string;
  points?: number;
  popularity?: number;
  
  // Geography & Details
  location?: string;
  
  // Related Data
  clans?: TeamResponse[];
  groups?: GroupResponse[];
  friends?: UserResponse[];
  friendCount?: number;
  
  // Features
  favTeam?: TeamResponse;
  popularGames?: GameResponse[];
  
  // Legacy compatibility fields (Optional)
  id_user?: string | number;
  user_id?: string | number;
  oyuncuID?: string | number;
}
