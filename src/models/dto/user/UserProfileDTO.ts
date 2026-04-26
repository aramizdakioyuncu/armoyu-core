export interface UserSocialsDTO {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  discord?: string;
  twitch?: string;
  steam?: string;
  linkedin?: string;
  github?: string;
  reddit?: string;
}

export interface UserRankDTO {
  id?: number;
  name?: string;
  category?: string;
  color?: string;
  logo?: string;
}

export interface UserFavoriteTeamDTO {
  id?: number;
  name?: string;
  logo?: string;
}

export interface UserGameDTO {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  score: number;
  money: number;
  role: string;
}

export interface UserProfileDTO {
  id: number;
  username: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  banner?: string;
  wallpaper?: string;
  level: number;
  levelXP: string;
  levelColor?: string;
  points: number;
  gender?: string;
  location?: string;
  province?: string;
  country?: string;
  status?: string;
  horoscope?: string;
  odp?: string;
  inviteCode?: string;
  birthday?: string;
  age?: number;
  lastLogin?: string;
  registeredDate?: string;
  job?: {
    name: string;
    shortName: string;
  };
  stats: {
    friendsCount: number;
    postsCount: number;
    commentsCount: number;
    groupsCount: number;
    gamesCount: number;
    commonFriendsCount?: number;
  };
  rank: UserRankDTO;
  socials: UserSocialsDTO;
  favoriteTeam?: UserFavoriteTeamDTO;
  popularGames: UserGameDTO[];
}
