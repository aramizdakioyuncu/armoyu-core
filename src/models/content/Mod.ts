import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';

/**
 * Represents a Game Mod (Oyun Modu) in the aramizdakioyuncu.com platform.
 */
export class Mod extends BaseModel {
  id: string = '';
  name: string = '';
  game: string = '';
  version: string = '';
  author: User | null = null;
  description: string = '';
  downloads: string = '';
  image: string = '';
  isFeatured: boolean = false;

  constructor(data: Partial<Mod>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Mod object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Mod {
    if (BaseModel.usePreviousApi) {
      return Mod.legacyFromJSON(json);
    }
    return Mod.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Mod {
    return new Mod({
      id: json.id || '',
      name: json.name || json.title || '',
      game: json.game || '',
      version: json.version || '',
      author: json.author ? (json.author instanceof User ? json.author : User.fromJSON(json.author)) : (json.authorUsername ? new User({ username: json.authorUsername, displayName: json.authorName }) : null),
      description: json.description || json.desc || '',
      downloads: json.downloads || '0',
      image: json.image || '',
      isFeatured: json.isFeatured || false,
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Mod {
    return new Mod({});
  }
}
