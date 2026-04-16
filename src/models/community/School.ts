import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';
import { Faculty } from './Faculty';
import { Classroom } from './Classroom';
import { SchoolTeam } from './SchoolTeam';

/**
 * Represents a School (Okul/Üniversite) in the ARMOYU education ecosystem.
 */
export class School extends BaseModel {
  id: string = '';
  name: string = '';
  slug: string = '';
  logo: string = '';
  background?: string = '';
  description?: string = '';
  
  representative: User | null = null;
  faculties: Faculty[] = [];
  teams: SchoolTeam[] = [];
  classrooms: Classroom[] = [];
  
  joinPassword?: string = '';
  isSocialFeedEnabled: boolean = true;
  memberCount: number = 0;

  constructor(data: Partial<School>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a School object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): School {
    if (BaseModel.usePreviousApi) {
      return School.legacyFromJSON(json);
    }
    return School.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): School {
    if (!json) return new School({});

    // Handle potential metadata objects (School_URL, etc.)
    const urlMetadata = json.School_URL || json.school_URL || json.okul_URL || json.okulURL || {};
    const hasUrlMetadata = typeof urlMetadata === 'object' && Object.keys(urlMetadata).length > 0;

    // Resolve Logo
    const logoField = json.School_logo || json.school_logo || json.okul_logo || json.avatar || {};
    let logoData = logoField;
    if (hasUrlMetadata) {
      const metadataLogo = urlMetadata.School_logo || urlMetadata.school_logo || urlMetadata.okul_logo || urlMetadata.logo;
      if (metadataLogo) logoData = metadataLogo;
    }

    // Resolve Background
    const bgData = json.Banner || json.banner || json.background || json.wallpaper || json.kapak || {};

    // Resolve Slug
    let slug = json.slug || json.url || '';
    if (hasUrlMetadata) {
      slug = urlMetadata.url || urlMetadata.slug || slug;
      if (typeof urlMetadata === 'string' && !slug) slug = urlMetadata;
    }

    return new School({
      id: String(json.id || json.okulID || ''),
      name: json.name || json.okul_ad || '',
      slug: String(slug),
      logo: typeof logoData === 'object' ? (logoData.media_minURL || logoData.media_URL || logoData.url || '') : logoData,
      background: typeof bgData === 'object' ? (bgData.media_URL || bgData.media_bigURL || bgData.url || '') : bgData,
      description: json.description || json.aciklama || '',
      representative: json.representative ? User.fromJSON(json.representative) : null,
      faculties: Array.isArray(json.faculties) ? json.faculties.map(Faculty.fromJSON) : [],
      teams: Array.isArray(json.teams) ? json.teams.map(SchoolTeam.fromJSON) : [],
      classrooms: Array.isArray(json.classrooms) ? json.classrooms.map(Classroom.fromJSON) : [],
      joinPassword: json.joinPassword || '',
      isSocialFeedEnabled: json.isSocialFeedEnabled !== undefined ? json.isSocialFeedEnabled : true,
      memberCount: Number(json.memberCount || json.uye_sayisi || 0)
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): School {
    return new School({});
  }
}
