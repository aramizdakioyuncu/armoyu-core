import { GroupDTO } from '../../dto/community/GroupDTO';

export class Group implements GroupDTO {
  id: number;
  name: string;
  displayName?: string;
  shortName?: string;
  slug?: string;
  description?: string;
  category?: string;
  tag?: string;
  logo?: string;
  banner?: string;
  wallpaper?: string;
  recruitmentStatus?: string | number;
  date?: string;
  registrationDate?: string;
  memberCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  founder?: string;
  role?: string;
  url?: string;
  socials?: {
    discord?: string;
    website?: string;
  };

  constructor(data: GroupDTO) {
    this.id = data.id;
    this.name = data.name;
    this.displayName = data.displayName;
    this.shortName = data.shortName;
    this.slug = data.slug;
    this.description = data.description;
    this.category = data.category;
    this.tag = data.tag;
    this.logo = data.logo;
    this.banner = data.banner;
    this.wallpaper = data.wallpaper;
    this.recruitmentStatus = data.recruitmentStatus;
    this.date = data.date;
    this.registrationDate = data.registrationDate;
    this.memberCount = data.memberCount;
    this.isPrivate = data.isPrivate;
    this.isVerified = data.isVerified;
    this.founder = data.founder;
    this.role = data.role;
    this.url = data.url;
    this.socials = data.socials;
  }

  /**
   * Returns a friendly URL slug for the group.
   */
  get groupSlug(): string {
    if (this.slug) return this.slug;
    return (this.name || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  /**
   * Returns the absolute group URL for the portal.
   */
  get portalUrl(): string {
    return `/gruplar/${this.groupSlug}`;
  }

  /**
   * Returns true if the group is verified.
   */
  get isOfficial(): boolean {
    return !!this.isVerified;
  }

  /**
   * Factory method to create a Group from a DTO.
   */
  static fromJSON(data: GroupDTO): Group {
    return new Group(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): GroupDTO {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      shortName: this.shortName,
      slug: this.slug,
      description: this.description,
      category: this.category,
      tag: this.tag,
      logo: this.logo,
      banner: this.banner,
      wallpaper: this.wallpaper,
      recruitmentStatus: this.recruitmentStatus,
      date: this.date,
      registrationDate: this.registrationDate,
      memberCount: this.memberCount,
      isPrivate: this.isPrivate,
      isVerified: this.isVerified,
      founder: this.founder,
      role: this.role,
      url: this.url,
      socials: this.socials
    };
  }
}
