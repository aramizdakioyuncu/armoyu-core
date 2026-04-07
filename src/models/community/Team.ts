/**
 * Represents a Sports Team (Takım) in the aramizdakioyuncu.com platform.
 */
export class Team {
  id: string = '';
  name: string = '';
  logo: string = '';
  primaryColor: string = '';
  shortName: string = '';

  constructor(data: Partial<Team>) {
    Object.assign(this, data);
  }

  static fromJSON(json: any): Team {
    return new Team({
      id: json.id || '',
      name: json.name || '',
      logo: json.logo || '',
      primaryColor: json.primaryColor || '#1d4ed8',
      shortName: json.shortName || ''
    });
  }
}
