import { BaseModel } from '../BaseModel';

/**
 * Represents a Workplace (İşyeri/Ofis) in the aramizdakioyuncu.com platform.
 */
export class Workplace extends BaseModel {
  id: string = '';
  name: string = '';
  description: string = '';
  location: string = '';
  logo: string = '';
  website: string = '';
  establishedDate: string = '';

  constructor(data: Partial<Workplace>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Workplace object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Workplace {
    if (BaseModel.usePreviousApi) {
      return Workplace.legacyFromJSON(json);
    }
    return Workplace.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Workplace {
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

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Workplace {
    return new Workplace({});
  }
}
