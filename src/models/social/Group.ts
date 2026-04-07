import { User } from '../auth/User';

/**
 * Represents a Group/Community/Guild in the aramizdakioyuncu.com platform.
 */
export class Group {
  id: string = '';
  name: string = '';
  shortName: string = '';
  slug: string = '';
  description: string = '';
  avatar: string = ''; // Keep for backward compatibility
  logo: string = '';
  banner: string = '';
  coverImage: string = ''; // Keep for backward compatibility
  memberCount: number = 0;
  isPrivate: boolean = false;
  category: string = '';
  tag: string = '';
  recruitment: string = 'Açık';
  date: string = '';
  owner: User | null = null;
  moderators: User[] = [];
  members: User[] = [];
  permissions: string[] = [];

  constructor(data: Partial<Group>) {
    Object.assign(this, data);
    if (!this.slug && this.name) {
      this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    if (!this.logo && this.avatar) this.logo = this.avatar;
    if (!this.banner && this.coverImage) this.banner = this.coverImage;
  }

  /**
   * Instantiates a Group object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Group {
    return new Group({
      id: json.id || '',
      name: json.name || '',
      shortName: json.shortName || json.tag || '',
      slug: json.slug || '',
      description: json.description || '',
      avatar: json.avatar || '',
      logo: json.logo || json.avatar || '',
      banner: json.banner || json.coverImage || json.cover_image || '',
      coverImage: json.coverImage || json.cover_image || '',
      memberCount: json.memberCount || json.member_count || 0,
      isPrivate: json.isPrivate || json.is_private || false,
      category: json.category || '',
      tag: json.tag || '',
      recruitment: json.recruitment || 'Açık',
      date: json.date || '',
      owner: json.owner ? User.fromJSON(json.owner) : null,
      moderators: Array.isArray(json.moderators) ? json.moderators.map((m: any) => User.fromJSON(m)) : [],
      members: Array.isArray(json.members) ? json.members.map((m: any) => User.fromJSON(m)) : [],
      permissions: Array.isArray(json.permissions) ? json.permissions : [],
    });
  }
}
