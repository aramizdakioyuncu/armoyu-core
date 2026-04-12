/**
 * Represents a province or city within a country.
 */
export class Province {
  id: number = 0;
  name: string = '';
  plateCode: number = 0;
  phoneCode: number = 0;

  constructor(data: Partial<Province>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Province object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Province {
    return new Province({
      id: Number(json.province_ID || 0),
      name: json.province_name || '',
      plateCode: Number(json.province_plateCode || 0),
      phoneCode: Number(json.province_phoneCode || 0)
    });
  }
}
