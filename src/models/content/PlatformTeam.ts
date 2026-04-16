import { BaseModel } from '../BaseModel';

/**
 * Represents a sports team or community team in the platform (Legacy Structure).
 */
export class PlatformTeam extends BaseModel {
  id: number = 0;
  name: string = '';
  logo: string = '';

  constructor(data: Partial<PlatformTeam>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a PlatformTeam object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): PlatformTeam {
    if (BaseModel.usePreviousApi) {
      return PlatformTeam.legacyFromJSON(json);
    }
    return PlatformTeam.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): PlatformTeam {
    return new PlatformTeam({
      id: Number(json.takim_ID || 0),
      name: json.takim_adi || '',
      logo: json.takim_logo || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): PlatformTeam {
    return new PlatformTeam({});
  }
}
