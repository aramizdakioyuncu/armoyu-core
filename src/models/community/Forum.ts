import { BaseModel } from '../BaseModel';

/**
 * Represents a Forum Board (Forum Bölümü) in the aramizdakioyuncu.com platform.
 */
export class Forum extends BaseModel {
  id: string = '';
  name: string = '';
  desc: string = '';
  topicCount: number = 0;
  postCount: number = 0;
  lastPost?: {
    topicTitle: string;
    author: string;
    avatar: string;
    time: string;
  };

  constructor(data: Partial<Forum>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Returns the absolute URL to the forum board.
   */
  getUrl(): string {
    return `/forum/${this.id}`;
  }

  /**
   * Instantiates a Forum object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Forum {
    if (BaseModel.usePreviousApi) {
      return Forum.legacyFromJSON(json);
    }
    return Forum.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Forum {
    return new Forum({
      id: json.id || '',
      name: json.name || json.title || '',
      desc: json.desc || json.description || '',
      topicCount: json.topicCount || 0,
      postCount: json.postCount || 0,
      lastPost: json.lastPost || undefined,
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Forum {
    return new Forum({});
  }
}
