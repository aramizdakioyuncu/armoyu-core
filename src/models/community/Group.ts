import { User } from '../auth/User';
import { NotificationSender } from '../social/NotificationSender';

/**
 * Represents a Group (Grup) in the aramizdakioyuncu.com platform.
 */
export class Group {
  id: string = '';
  name: string = '';
  shortName: string = '';
  slug: string = '';
  description: string = '';
  category: string = '';
  tag: string = '';
  banner: string = '';
  logo: string = '';
  recruitment: string = 'Açık';
  date: string = '';
  memberCount: number = 0;
  isPrivate: boolean = false;
  owner: User | null = null;
  moderators: User[] = [];
  members: User[] = [];
  permissions: string[] = [];

  constructor(data: Partial<Group>) {
    Object.assign(this, data);
    if (!this.slug && this.name) {
      this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
  }

  /**
   * Returns the absolute URL to the group's page.
   */
  getGroupUrl(): string {
    return `/gruplar/${this.slug || this.name.toLowerCase().replace(/\s+/g, '-')}`;
  }

  /**
   * Converts the group to a standardized notification sender.
   */
  toNotificationSender(): NotificationSender {
    return new NotificationSender({
      id: this.id,
      name: this.name,
      avatar: this.logo,
      type: 'GROUP',
      url: this.getGroupUrl()
    });
  }

  /**
   * Instantiates a Group object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Group {
    return new Group({
      id: json.id || '',
      name: json.name || '',
      shortName: json.shortName || json.name_short || '',
      slug: json.slug || '',
      description: json.description || '',
      category: json.category || '',
      tag: json.tag || '',
      banner: json.banner || json.banner_url || '',
      logo: json.logo || json.logo_url || '',
      recruitment: json.recruitment || 'Açık',
      date: json.date || json.created_at || '',
      memberCount: json.memberCount || json.member_count || 0,
      isPrivate: json.isPrivate || json.is_private || false,
      owner: json.owner ? User.fromJSON(json.owner) : null,
      moderators: Array.isArray(json.moderators) ? json.moderators.map((m: any) => User.fromJSON(m)) : [],
      members: Array.isArray(json.members) ? json.members.map((m: any) => User.fromJSON(m)) : [],
      permissions: Array.isArray(json.permissions) ? json.permissions : [],
    });
  }
}
