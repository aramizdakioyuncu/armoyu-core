import { BaseModel } from '../BaseModel';

/**
 * Represents a Station (Business unit) in the platform (Legacy Structure).
 */
export class PlatformStation extends BaseModel {
  id: number = 0;
  name: string = '';
  url: string = '';
  type: string = '';
  memberCount: number = 0;
  logo: string = '';
  banner: string = '';

  constructor(data: Partial<PlatformStation>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a PlatformStation object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): PlatformStation {
    if (BaseModel.usePreviousApi) {
      return PlatformStation.legacyFromJSON(json);
    }
    return PlatformStation.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): PlatformStation {
    return new PlatformStation({
      id: Number(json.station_ID || 0),
      name: json.station_name || '',
      url: json.station_URL || '',
      type: json.station_type || '',
      memberCount: Number(json.station_uyesayisi || 0),
      logo: json.station_logo?.media_URL || '',
      banner: json.station_banner?.media_URL || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): PlatformStation {
    return new PlatformStation({});
  }
}
