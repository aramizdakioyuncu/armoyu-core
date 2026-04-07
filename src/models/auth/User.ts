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
    return new User({
      id: json.id || json.id_user || '',
      username: json.username || '',
      displayName: json.displayName || json.name || json.username || '',
      avatar: json.avatar || json.avatar_url || '',
      banner: json.banner || json.banner_url || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop',
      bio: json.bio || '',
      role: json.role ? Role.fromJSON(json.role) : null,
      verified: json.verified || false,
      level: json.level || json.user_level || 1,
      xp: json.xp || json.experience || 0,
      popScore: json.popScore || 0,
      groups: json.groups || [],
      friends: Array.isArray(json.friends) ? json.friends.map((f: any) => {
        // Shallow conversion to avoid infinite recursion
        if (f instanceof User) return f;
        return new User({
          id: f.id || f.id_user || '',
          username: f.username || '',
          displayName: f.displayName || f.name || f.username || '',
          avatar: f.avatar || f.avatar_url || '',
          role: f.role ? Role.fromJSON(f.role) : null,
          verified: f.verified || false,
          level: f.level || 1
        });
      }) : [],
    });
  }
}
