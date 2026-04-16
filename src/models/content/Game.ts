import { BaseModel } from '../BaseModel';

/**
 * Represents a Game in the aramizdakioyuncu.com platform.
 */
export class Game extends BaseModel {
  id: string = '';
  shortName: string = '';
  name: string = '';
  slug: string = '';
  logo: string = '';
  poster: string = '';
  category: string = '';
  developer: string = '';
  description: string = '';

  constructor(data: Partial<Game>) {
    super();
    Object.assign(this, data);
    if (!this.slug && this.name) {
      this.slug = this.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
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
      id: json.id || '',
      name: json.name || '',
      slug: json.slug || '',
      logo: json.logo || json.logo_url || '',
      poster: json.poster || json.poster_url || '',
      category: json.category || '',
      developer: json.developer || '',
      description: json.description || '',
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
