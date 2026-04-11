import { Role } from './Role';
import { NotificationSender } from '../social/NotificationSender';
import { Team } from '../community/Team';
import { UserBadge, mapBadgeFromJSON } from './UserBadge';
import { Game } from '../social/Game';
import { Post } from '../social/Post';

export interface CareerEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'JOIN' | 'RANK' | 'GROUP' | 'AWARD' | 'SYSTEM';
  icon?: string;
}

/**
 * Represents a User in the aramizdakioyuncu.com platform.
 */
export class User {
  id: string = '';
  username: string = '';
  displayName: string = '';
  avatar: string = '';
  banner: string = '';
  bio: string = '';
  role: Role | null = null;
  verified: boolean = false;
  level: number = 1;
  xp: number = 0;
  popScore: number = 0;
  groups: any[] = []; 
  friends: User[] = [];
  myPosts: any[] = [];
  career: CareerEvent[] = [];
  zodiac?: string;
  favoriteTeam?: Team | null;
  punishmentCount: number = 0;
  distrustScore: number = 1.0; // Starts at 1.0 (Safe)
  odp: number = 50; // Player Rating Score (0-100)
  createdAt: string = '';
  location: string = '';
  
  // Stats
  followerCount: number = 0;
  followingCount: number = 0;
  viewsCount: number = 0;

  // Socials
  socials: Record<string, string> = {};

  // Additional Info
  firstName: string = '';
  lastName: string = '';
  isOnline: boolean = false;
  lastSeen: string = '';
  gender: string = '';
  birthday: string = '';
  email?: string;
  phoneNumber?: string;
  rankTitle: string = '';
  badges: UserBadge[] = [];

  // Platform Metrics
  rating: number = 0; // ODP
  memberNumber: string = ''; // kulno
  levelColor: string = '';
  headerImage: string = ''; // wallpaper
  
  // Profile Stats
  age: number = 0;
  inviteCode: string = '';
  lastLoginAt: string = '';
  registeredAt: string = '';
  
  // Location & Job
  country: string = '';
  city: string = '';
  jobTitle: string = '';
  defaultGroupId: string = '';

  // Stats & Counts
  friendCount: number = 0;
  postCount: number = 0;
  awardCount: number = 0;
  mutualFriendsCount: number = 0;
  gameCount: number = 0;

  // Metadata
  isFriend: boolean = false;
  isFollowing: boolean = false;
  friendStatusText: string = '';

  // Leveling
  xpTarget: number = 1000;

  // Lists
  popularGames: Game[] = [];
  mutualFriends: User[] = [];

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    // Ensure numeric defaults
    this.punishmentCount = Number(data.punishmentCount || 0);
    this.distrustScore = Number(data.distrustScore || 1.0);
    this.odp = Number(data.odp || 50);
    this.level = Number(data.level || 1);
    this.xp = Number(data.xp || 0);
    this.xpTarget = Number(data.xpTarget || 1000);
    this.followerCount = Number(data.followerCount || 0);
    this.followingCount = Number(data.followingCount || 0);
    this.viewsCount = Number(data.viewsCount || 0);
  }

  /**
   * Adds a new event to the user's career timeline.
   */
  addCareerEvent(event: Omit<CareerEvent, 'id'>) {
    const newEvent: CareerEvent = {
      ...event,
      id: `CR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };
    this.career = [newEvent, ...(this.career || [])];
  }

  /**
   * Returns the absolute URL to the user's profile page.
   */
  getProfileUrl(): string {
    return `/oyuncular/${this.username}`;
  }

  /**
   * Returns the user's full name (combining firstName and lastName).
   */
  getFullName(): string {
    if (this.firstName || this.lastName) {
      return `${this.firstName} ${this.lastName}`.trim();
    }
    return this.displayName || this.username;
  }

  /**
   * Returns the user's name (displayName preferred, falls back to getFullName or username).
   */
  getName(): string {
    return this.displayName || this.getFullName() || this.username;
  }

  /**
   * Returns whether the user is currently online.
   */
  isUserOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Returns a percentage (0-100) of progress to the next level.
   */
  getXpProgress(): number {
    if (this.xpTarget <= 0) return 0;
    return Math.min(100, Math.max(0, (this.xp / this.xpTarget) * 100));
  }

  /**
   * Converts the user to a standardized notification sender.
   */
  toNotificationSender(): NotificationSender {
    return new NotificationSender({
      id: this.id,
      name: this.displayName,
      avatar: this.avatar,
      type: 'USER',
      url: this.getProfileUrl()
    });
  }

  /**
   * Instantiates a User object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): User {
    const avatarData = json.avatar || json.oyuncu_avatar || {};
    const bannerData = json.banner || json.oyuncu_kapak || json.kapak || {};
    const wallpaperData = json.wallpaper || {};
    const detailInfo = json.detailInfo || json.oyuncu_bilgi || json.detail_info || {};
    const userRole = json.userRole || json.oyuncu_rutbe || {};
    const jobData = json.job || {};
    const countryData = detailInfo.country || {};
    const provinceData = detailInfo.province || {};
    const banHistory = json.banHistory || {};

    return new User({
      id: String(json.playerID || json.id || json.owner_ID || json.id_user || json.user_id || ''),
      username: json.username || json.user_name || json.owner_username || json.oyuncu_ad || '',
      displayName: json.displayname || json.owner_displayname || json.displayName || json.user_displayname || json.name || json.username || '',
      firstName: json.firstName || '',
      lastName: json.lastName || '',
      avatar: typeof avatarData === 'object' ? (avatarData.media_URL || avatarData.media_minURL || avatarData.media_bigURL || '') : avatarData,
      banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.media_minURL || '') : bannerData,
      headerImage: typeof wallpaperData === 'object' ? (wallpaperData.media_URL || wallpaperData.media_bigURL || '') : wallpaperData,
      bio: detailInfo.about || detailInfo.aciklama || json.bio || json.oyuncu_bio || json.aciklama || json.description || '',
      role: userRole.roleName ? Role.fromJSON({ name: userRole.roleName, color: userRole.roleColor }) : (json.role ? Role.fromJSON(json.role) : null),
      verified: json.verified === true || json.oyuncu_onay === 1 || json.oyuncu_onay === '1' || false,
      level: Number(json.level || json.oyuncu_seviye || 1),
      levelColor: json.levelColor || '',
      xp: Number(json.levelXP || json.xp || json.user_xp || 0),
      xpTarget: Number(json.nextLevelXP || json.xpTarget || json.seviye_xp_hedef || 1000),
      popScore: Number(json.popScore || json.user_popscore || 0),
      rating: Number(json.ODP || json.rating || 0),
      memberNumber: String(json.kulno || json.memberNumber || ''),
      
      age: Number(detailInfo.age || 0),
      inviteCode: detailInfo.inviteCode || '',
      lastLoginAt: detailInfo.lastloginDate || '',
      registeredAt: json.registeredDate || json.created_at || '',
      
      country: countryData.country_name || '',
      city: provinceData.province_name || detailInfo.location || json.location || json.sehir || '',
      jobTitle: jobData.job_name || '',
      defaultGroupId: String(json.defaultGroup?.group_ID || ''),

      groups: json.groups || json.user_groups || [],
      friendCount: Number(detailInfo.friends || 0),
      postCount: Number(detailInfo.posts || 0),
      awardCount: Number(detailInfo.awards || 0),
      mutualFriendsCount: Number(json.ortakarkadaslar || 0),
      gameCount: Number(json.mevcutoyunsayisi || 0),

      friends: Array.isArray(json.friends || json.arkadasliste) ? (json.friends || json.arkadasliste).map((f: any) => {
        if (f instanceof User) return f;
        // Handle simpler list objects from API
        const friendJson = {
          playerID: f.playerID || f.oyuncuID,
          username: f.username || f.oyuncukullaniciadi,
          avatar: { media_URL: f.avatar || f.oyuncuminnakavatar }
        };
        return User.fromJSON(friendJson);
      }) : [],
      
      mutualFriends: Array.isArray(json.ortakarkadasliste) ? json.ortakarkadasliste.map((f: any) => {
        const friendJson = {
          playerID: f.oyuncuID,
          username: f.oyuncukullaniciadi,
          avatar: { media_URL: f.oyuncuminnakavatar }
        };
        return User.fromJSON(friendJson);
      }) : [],

      followerCount: Number(json.followerCount || json.follower_count || json.oyuncu_takipci || 0),
      followingCount: Number(json.followingCount || json.following_count || json.oyuncu_takip_edilen || 0),
      viewsCount: Number(json.viewsCount || json.views_count || json.oyuncu_goruntulenme || 0),
      zodiac: json.zodiac || json.burc || detailInfo.zodiac || '',
      favoriteTeam: (json.favoriteTeam || json.favorite_team || json.favori_takim || detailInfo.favorite_team || json.favTeam) ? Team.fromJSON(json.favoriteTeam || json.favorite_team || json.favori_takim || detailInfo.favorite_team || json.favTeam) : null,
      createdAt: json.createdAt || json.created_at || json.kayit_tarihi || detailInfo.created_at || '',
      location: detailInfo.location || json.location || json.sehir || detailInfo.city || detailInfo.sehir || '',
      
      isOnline: json.isOnline === true || json.is_online === 1 || json.oyuncu_online === 1 || false,
      lastSeen: json.lastSeen || json.last_login || json.son_gorulme || detailInfo.last_login || '',
      gender: json.gender || json.cinsiyet || detailInfo.gender || detailInfo.cinsiyet || '',
      birthday: json.birthday || json.dogum_tarihi || detailInfo.birthday || detailInfo.dogum_tarihi || detailInfo.birthdayDate || '',
      email: json.email || json.user_email || detailInfo.email || '',
      phoneNumber: json.phoneNumber || json.phone || json.telefon || detailInfo.phoneNumber || '',
      rankTitle: json.rankTitle || json.rank_name || json.rutbe_ad || userRole.roleName || '',
      isFriend: json.isFriend === true || json.is_friend === 1 || Number(json.arkadasdurum) === 1 || false,
      isFollowing: json.isFollowing === true || json.is_following === 1 || false,
      friendStatusText: json.arkadasdurumaciklama || '',
      badges: Array.isArray(json.badges || json.rozetler) ? (json.badges || json.rozetler).map((b: any) => mapBadgeFromJSON(b)) : [],
      popularGames: Array.isArray(json.popularGames) ? json.popularGames.map((g: any) => Game.fromJSON(g)) : [],
      
      socials: {
        discord: detailInfo.discord || json.discord || '',
        steam: detailInfo.steam || json.steam || jobData.steam || json.socailAccounts?.steam || '',
        instagram: detailInfo.instagram || json.instagram || json.socailAccounts?.instagram || '',
        twitter: detailInfo.twitter || json.twitter || json.socailAccounts?.twitter || '',
        facebook: detailInfo.facebook || json.facebook || json.socailAccounts?.facebook || '',
        linkedin: detailInfo.linkedin || json.linkedin || json.socailAccounts?.linkedin || '',
        youtube: json.socailAccounts?.youtube || '',
        twitch: json.socailAccounts?.twitch || '',
        github: json.socailAccounts?.github || '',
        ...(json.socials || json.social_media || detailInfo.socials || {})
      }
    });
  }
}
