import { BaseModel } from '../BaseModel';

/**
 * Represents a country in the platform.
 */
export class Country extends BaseModel {
  id: number = 0;
  name: string = '';
  code: string = '';
  phoneCode: number = 0;

  constructor(data: Partial<Country>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Country object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Country {
    if (BaseModel.usePreviousApi) {
      return Country.legacyFromJSON(json);
    }
    return Country.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Country {
    return new Country({
      id: Number(json.country_ID || 0),
      name: json.country_name || '',
      code: json.country_code || '',
      phoneCode: Number(json.country_phoneCode || 0)
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Country {
    return new Country({});
  }
}
