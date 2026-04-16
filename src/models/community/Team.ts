import { BaseModel } from '../BaseModel';

/**
 * Represents a Sports Team (Takım) in the aramizdakioyuncu.com platform.
 */
export class Team extends BaseModel {
  id: string = '';
  name: string = '';
  shortName: string = '';
  slug: string = '';
  logo: string = '';
  banner: string = '';
  primaryColor: string = '';
  category: string = '';
  description: string = '';
  foundedDate: string = '';
  website: string = '';

  constructor(data: Partial<Team>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Team object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Team {
    if (BaseModel.usePreviousApi) {
      return Team.legacyFromJSON(json);
    }
    return Team.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Team {
    if (!json) return new Team({});

    // Handle potential metadata objects (Team_URL, etc.)
    const urlMetadata = json.Team_URL || json.team_URL || json.takim_URL || json.takimURL || {};
    const hasUrlMetadata = typeof urlMetadata === 'object' && Object.keys(urlMetadata).length > 0;

    // Resolve Logo
    const logoField = json.Team_logo || json.team_logo || json.takim_logo || json.takim_minnakavatar || json.avatar || {};
    let logoData = logoField;
    if (hasUrlMetadata) {
      const metadataLogo = urlMetadata.Team_logo || urlMetadata.team_logo || urlMetadata.takim_logo || urlMetadata.logo;
      if (metadataLogo) logoData = metadataLogo;
    }

    // Resolve Banner
    const bannerData = json.Banner || json.banner || json.takim_kapak || json.cover || json.team_banner || {};

    // Resolve Slug
    let slug = json.slug || json.url || '';
    if (hasUrlMetadata) {
      slug = urlMetadata.url || urlMetadata.slug || slug;
      if (typeof urlMetadata === 'string' && !slug) slug = urlMetadata;
    }

    return new Team({
      id: String(json.id || json.takim_id || json.teamID || json.team_ID || ''),
      name: json.name || json.takim_ad || json.teamName || json.team_name || '',
      shortName: json.shortName || json.takim_kisa_ad || json.tag || json.team_shortName || '',
      slug: String(slug),
      logo: typeof logoData === 'object' ? (logoData.media_minURL || logoData.media_URL || logoData.media_bigURL || logoData.url || '') : logoData,
      banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.media_minURL || bannerData.url || '') : bannerData,
      primaryColor: json.primaryColor || json.takim_renk || json.team_color || '#1d4ed8',
      category: json.category || json.takim_kategori || '',
      description: json.description || json.takim_aciklama || '',
      foundedDate: json.foundedDate || json.kurulus_tarihi || '',
      website: json.website || json.takim_web_sitesi || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Team {
    return new Team({});
  }
}
