import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';

/**
 * Represents a Social Story.
 */
export class Story extends BaseModel {
  id: string = '';
  author: User | null = null;
  media: string = '';
  timestamp: string = '';
  isViewed: boolean = false;

  constructor(data: Partial<Story>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Story object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Story {
    if (BaseModel.usePreviousApi) {
      return Story.legacyFromJSON(json);
    }
    return Story.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Story {
    return new Story({
      id: String(json.id || json.hikayeid || ''),
      author: json.author ? User.fromJSON(json.author) : (json.oyuncu ? User.fromJSON(json.oyuncu) : null),
      media: json.media || json.resim || json.url || '',
      timestamp: json.timestamp || json.tarih || '',
      isViewed: json.isViewed === true || json.izlendi === 1 || false
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Story {
    return new Story({});
  }
}
