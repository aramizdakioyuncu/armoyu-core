import { UserProfileDTO, UserSocialsDTO } from '../../dto/user/UserProfileDTO';

export class User {
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
  rank: any;
  socials: UserSocialsDTO;
  favoriteTeam?: any;
  popularGames: any[];

  constructor(data: UserProfileDTO) {
    this.id = data.id;
    this.username = data.username;
    this.displayName = data.displayName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.avatar = data.avatar;
    this.banner = data.banner;
    this.wallpaper = data.wallpaper;
    this.level = data.level;
    this.levelXP = data.levelXP;
    this.levelColor = data.levelColor;
    this.points = data.points;
    this.gender = data.gender;
    this.location = data.location;
    this.province = data.province;
    this.country = data.country;
    this.status = data.status;
    this.horoscope = data.horoscope;
    this.odp = data.odp;
    this.inviteCode = data.inviteCode;
    this.birthday = data.birthday;
    this.age = data.age;
    this.lastLogin = data.lastLogin;
    this.registeredDate = data.registeredDate;
    this.job = data.job;
    this.stats = data.stats;
    this.rank = data.rank;
    this.socials = data.socials;
    this.favoriteTeam = data.favoriteTeam;
    this.popularGames = data.popularGames;
  }

  /**
   * Returns the full name of the user.
   */
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.displayName || this.username;
  }

  /**
   * Returns a clean URL for the user's profile.
   */
  get profileUrl(): string {
    return `/profil/${this.username}`;
  }

  /**
   * Helper to check if user has a specific social link.
   */
  hasSocial(platform: keyof UserSocialsDTO): boolean {
    return !!this.socials[platform];
  }

  /**
   * Factory method to create a User from a DTO.
   */
  static fromJSON(data: UserProfileDTO): User {
    return new User(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): UserProfileDTO {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      banner: this.banner,
      wallpaper: this.wallpaper,
      level: this.level,
      levelXP: this.levelXP,
      levelColor: this.levelColor,
      points: this.points,
      gender: this.gender,
      location: this.location,
      province: this.province,
      country: this.country,
      status: this.status,
      horoscope: this.horoscope,
      odp: this.odp,
      inviteCode: this.inviteCode,
      birthday: this.birthday,
      age: this.age,
      lastLogin: this.lastLogin,
      registeredDate: this.registeredDate,
      job: this.job,
      stats: this.stats,
      rank: this.rank,
      socials: this.socials,
      favoriteTeam: this.favoriteTeam,
      popularGames: this.popularGames
    };
  }
}
