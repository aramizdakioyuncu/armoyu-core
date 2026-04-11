/**
 * Represents a Sports Team (Takım) in the aramizdakioyuncu.com platform.
 */
export class Team {
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
    Object.assign(this, data);
  }

  static fromJSON(json: any): Team {
    if (!json) return new Team({});
    return new Team({
      id: String(json.id || json.takim_id || json.teamID || json.team_ID || ''),
      name: json.name || json.takim_ad || json.teamName || json.team_name || '',
      shortName: json.shortName || json.takim_kisa_ad || json.tag || json.team_shortName || '',
      slug: json.slug || json.takim_slug || json.team_URL || '',
      logo: json.logo || json.takim_logo || json.avatar || json.team_logo || '',
      banner: json.banner || json.takim_kapak || json.cover || json.team_banner || '',
      primaryColor: json.primaryColor || json.takim_renk || json.team_color || '#1d4ed8',
      category: json.category || json.takim_kategori || '',
      description: json.description || json.takim_aciklama || '',
      foundedDate: json.foundedDate || json.kurulus_tarihi || '',
      website: json.website || json.takim_web_sitesi || ''
    });
  }
}
