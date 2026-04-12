/**
 * Represents a Station (Business unit) in the platform (Legacy Structure).
 */
export class PlatformStation {
  id: number = 0;
  name: string = '';
  url: string = '';
  type: string = '';
  memberCount: number = 0;
  logo: string = '';
  banner: string = '';

  constructor(data: Partial<PlatformStation>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a PlatformStation object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): PlatformStation {
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
}
