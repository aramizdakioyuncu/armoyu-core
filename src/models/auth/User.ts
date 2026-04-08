import { Role } from './Role';
import { NotificationSender } from '../social/NotificationSender';
import { Team } from '../community/Team';

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
  favoriteTeam?: any; // To avoid circular dependency if needed, or use Team
  punishmentCount: number = 0;
  distrustScore: number = 1.0; // Starts at 1.0 (Safe)
  odp: number = 50; // Player Rating Score (0-100)

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    // Ensure numeric defaults
    this.punishmentCount = data.punishmentCount || 0;
    this.distrustScore = data.distrustScore || 1.0;
    this.odp = data.odp || 50;
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
    const avatarData = json.avatar || {};
    const bannerData = json.banner || {};
    const detailInfo = json.detailInfo || {};
    const userRole = json.userRole || {};

    return new User({
      id: String(json.owner_ID || json.playerID || json.id || json.id_user || json.user_id || ''),
      username: json.username || json.user_name || json.owner_username || json.oyuncu_ad || '',
      displayName: json.displayname || json.owner_displayname || json.displayName || json.user_displayname || json.name || json.username || '',
      avatar: typeof avatarData === 'object' ? (avatarData.media_URL || avatarData.media_minURL || avatarData.media_bigURL || '') : avatarData,
      banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.media_minURL || '') : bannerData,
      bio: detailInfo.about || json.bio || json.oyuncu_bio || '',
      role: userRole.roleName ? Role.fromJSON({ name: userRole.roleName, color: userRole.roleColor }) : (json.role ? Role.fromJSON(json.role) : null),
      verified: json.verified || (json.oyuncu_onay === 1) || false,
      level: Number(json.level || json.oyuncu_seviye || 1),
      xp: Number(json.levelXP || json.xp || json.user_xp || 0),
      popScore: Number(json.popScore || json.user_popscore || 0),
      groups: json.groups || json.user_groups || [],
      friends: Array.isArray(json.friends) ? json.friends.map((f: any) => {
        if (f instanceof User) return f;
        return User.fromJSON(f);
      }) : [],
    });
  }
}
