import { BaseModel } from '../../BaseModel';

/**
 * Represents a Game in the ARMOYU platform.
 */
export class Game extends BaseModel {
  id: string = '';
  title: string = '';
  shortName: string = '';
  logo: string = '';
  banner: string = '';
  description: string = '';
  rating: number = 0;
  category: string = '';

  constructor(data: Partial<Game>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Game object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Game {
    if (BaseModel.usePreviousApi) {
      return Game.legacyFromJSON(json);
    }
    return Game.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Game {
    return new Game({
      id: String(json.id || json.oyunid || ''),
      title: json.title || json.ad || '',
      shortName: json.shortName || json.kisa_ad || '',
      logo: json.logo || json.minnakresim || '',
      banner: json.banner || json.buyukresim || '',
      description: json.description || json.aciklama || '',
      rating: Number(json.rating || json.puan || 0),
      category: json.category || json.tür || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Game {
    return new Game({});
  }
}
