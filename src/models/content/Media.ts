import { BaseModel } from '../BaseModel';

/**
 * Represents a Media item (Fotoğraf/Video) in the aramizdakioyuncu.com platform.
 */
export class Media extends BaseModel {
  title: string = '';
  count: number = 0;
  author: string = '';
  date: string = '';
  category: string = '';
  image: string = '';

  constructor(data: Partial<Media>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Media object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Media {
    if (BaseModel.usePreviousApi) {
      return Media.legacyFromJSON(json);
    }
    return Media.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Media {
    return new Media({
      title: json.title || '',
      count: json.count || 0,
      author: json.author || '',
      date: json.date || '',
      category: json.category || '',
      image: json.image || json.thumb || '',
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Media {
    return new Media({});
  }
}
