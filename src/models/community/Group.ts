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
      id: String(json.id || json.grupID || json.grup_ID || json.group_ID || json.groupID || ''),
      name: json.name || json.grupad || json.grup_ad || json.title || '',
      shortName: json.shortName || json.name_short || json.grup_kisaad || '',
      slug: json.slug || json.grupURL || json.group_URL || '',
      description: json.description || json.grup_aciklama || '',
      category: json.category || json.grup_kategori || '',
      tag: json.tag || json.grup_etiket || '',
      banner: json.banner || json.banner_url || json.grup_wallpaper || json.grup_vbanner || '',
      logo: json.logo || json.logo_url || json.grup_minnakavatar || json.grup_logo || '',
      recruitment: json.recruitment || json.alimdurum || 'Açık',
      date: json.date || json.created_at || json.grup_kurulus || '',
      memberCount: Number(json.memberCount || json.member_count || json.grupuyesayisi || 0),
      isPrivate: json.isPrivate || json.is_private || false,
      owner: json.owner ? User.fromJSON(json.owner) : null,
      moderators: Array.isArray(json.moderators) ? json.moderators.map((m: any) => User.fromJSON(m)) : [],
      members: Array.isArray(json.members) ? json.members.map((m: any) => User.fromJSON(m)) : [],
      permissions: Array.isArray(json.permissions) ? json.permissions : [],
    });
  }
}
