import { BaseModel } from '../../BaseModel';

/**
 * Represents a personal note or status (Instagram style).
 */
export class Note extends BaseModel {
  username: string = '';
  content: string = '';
  avatar: string = '';
  createdAt: string = '';

  constructor(data: Partial<Note>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Note object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Note {
    if (BaseModel.usePreviousApi) {
      return Note.legacyFromJSON(json);
    }
    return Note.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Note {
    return new Note({
      username: json.username || json.kulladi || '',
      content: json.content || json.icerik || json.text || '',
      avatar: json.avatar || json.oyuncuminnakavatar || '',
      createdAt: json.createdAt || json.created_at || json.zaman || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Note {
    return new Note({});
  }
}
