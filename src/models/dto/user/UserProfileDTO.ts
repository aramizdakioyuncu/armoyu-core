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
  id?: number | string;
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
  email?: string;
  phone?: string;
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
  mutualFriendsCount?: number;
  /** Görüntüleyenle ilişki: 0 yok, 1 arkadaş, 2 istek gönderilmiş, 3 gelen istek */
  friendshipStatus?: number;
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
    mutualFriendsCount?: number;
  };
  rank: UserRankDTO;
  socials: UserSocialsDTO;
  favoriteTeam?: UserFavoriteTeamDTO;
  /** Ruh eşi (yalnızca arkadaş seçilebilir) */
  soulmate?: { id: string; username: string; displayName: string; avatar: string } | null;
  /** Eğitim bilgisi (Profiller 1.6.0) */
  education?: { id: string; schoolName: string; kind: string; department: string; startYear: number | null; endYear: number | null }[];
  popularGames: UserGameDTO[];
  mutualFriends?: any[];
}
