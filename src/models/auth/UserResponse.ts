import { GroupDTO } from '../dto/community/GroupDTO';
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
  zodiac?: string;
  jobTitle?: string;
  socials?: Record<string, string>;
  // Geography & Details
  location?: string;
  city?: string;
  province?: string;
  country?: string;

  // Leveling & Stats
  level?: number;
  levelColor?: string;
  xp?: number;
  xpNext?: number;
  xpTarget?: number;
  rank?: string;
  rankTitle?: string;
  rankCategory?: string;
  rankImage?: string;
  rankColor?: string;
  points?: number;
  popularity?: number;
  odp?: number | string;
  memberNumber?: string;

  // Stats
  friendCount?: number;
  postCount?: number;
  awardCount?: number;
  gameCount?: number;
  mutualFriendsCount?: number;
  
  // Status Details
  friendStatusText?: string;
  lastSeen?: string;

  // Related Data
  clans?: TeamResponse[];
  groups?: GroupDTO[];
  friends?: UserResponse[];

  // Features
  favTeam?: TeamResponse;
  popularGames?: GameResponse[];

  // Legacy compatibility fields (Optional)
  id_user?: string | number;
  user_id?: string | number;
  oyuncuID?: string | number;
}
