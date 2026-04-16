import { BaseModel } from '../../BaseModel';

/**
 * Represents an option in a Poll.
 */
export class PollOption extends BaseModel {
  id: string = '';
  text: string = '';
  votes: number = 0;
  isVoted: boolean = false;

  constructor(data: Partial<PollOption>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a PollOption object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): PollOption {
    if (BaseModel.usePreviousApi) {
      return PollOption.legacyFromJSON(json);
    }
    return PollOption.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): PollOption {
    return new PollOption({
      id: String(json.id || json.secenekid || ''),
      text: json.text || json.secenek || '',
      votes: Number(json.votes || json.oy_sayi || 0),
      isVoted: json.isVoted === true || json.secildi === 1 || false
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): PollOption {
    return new PollOption({});
  }
}
