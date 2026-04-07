/**
 * Represents a Workplace (İşyeri/Ofis) in the aramizdakioyuncu.com platform.
 */
export class Workplace {
  id: string = '';
  name: string = '';
  description: string = '';
  location: string = '';
  logo: string = '';
  website: string = '';
  establishedDate: string = '';

  constructor(data: Partial<Workplace>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Workplace object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Workplace {
    return new Workplace({
      id: json.id || '',
      name: json.name || json.title || '',
      description: json.description || '',
      location: json.location || json.address || '',
      logo: json.logo || json.logo_url || '',
      website: json.website || '',
      establishedDate: json.establishedDate || json.created_at || '',
    });
  }
}
