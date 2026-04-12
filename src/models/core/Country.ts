/**
 * Represents a country in the platform.
 */
export class Country {
  id: number = 0;
  name: string = '';
  code: string = '';
  phoneCode: number = 0;

  constructor(data: Partial<Country>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Country object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Country {
    return new Country({
      id: Number(json.country_ID || 0),
      name: json.country_name || '',
      code: json.country_code || '',
      phoneCode: Number(json.country_phoneCode || 0)
    });
  }
}
