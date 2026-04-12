/**
 * Represents a sports team or community team in the platform (Legacy Structure).
 */
export class PlatformTeam {
  id: number = 0;
  name: string = '';
  logo: string = '';

  constructor(data: Partial<PlatformTeam>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a PlatformTeam object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): PlatformTeam {
    return new PlatformTeam({
      id: Number(json.takim_ID || 0),
      name: json.takim_adi || '',
      logo: json.takim_logo || ''
    });
  }
}
