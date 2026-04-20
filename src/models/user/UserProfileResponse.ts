export interface UserSocialsResponse {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  discord?: string;
  twitch?: string;
  steam?: string;
}

export interface UserRankResponse {
  name?: string;
  logo?: string;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  banner?: string;
  level: number;
  xp: number;
  xpNext: number;
  points: number;
  gender?: string;
  location?: string;
  status?: string;
  stats: {
    friendsCount: number;
    postsCount: number;
    commentsCount: number;
    groupsCount: number;
  };
  rank: UserRankResponse;
  socials: UserSocialsResponse;
}
