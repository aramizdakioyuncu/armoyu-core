import { BaseModel } from '../BaseModel';

/**
 * Represents a province or city within a country.
 */
export class Province extends BaseModel {
  id: number = 0;
  name: string = '';
  plateCode: number = 0;
  phoneCode: number = 0;

  constructor(data: Partial<Province>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Province object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Province {
    if (BaseModel.usePreviousApi) {
      return Province.legacyFromJSON(json);
    }
    return Province.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Province {
    return new Province({
      id: Number(json.province_ID || 0),
      name: json.province_name || '',
      plateCode: Number(json.province_plateCode || 0),
      phoneCode: Number(json.province_phoneCode || 0)
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Province {
    return new Province({});
  }
}
