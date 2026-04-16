import { BaseModel } from '../BaseModel';

/**
 * Represents a Giveaway (Çekiliş) in the aramizdakioyuncu.com platform.
 */
export class Giveaway extends BaseModel {
  id: string = '';
  title: string = '';
  prize: string = '';
  status: 'active' | 'ended' = 'active';
  participants: number = 0;
  timeLeft: string = '';
  image: string = '';

  constructor(data: Partial<Giveaway>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Returns true if the giveaway is currently active.
   */
  isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Instantiates a Giveaway object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Giveaway {
    if (BaseModel.usePreviousApi) {
      return Giveaway.legacyFromJSON(json);
    }
    return Giveaway.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Giveaway {
    return new Giveaway({
      id: json.id || '',
      title: json.title || '',
      prize: json.prize || '',
      status: json.status || 'active',
      participants: json.participants || 0,
      timeLeft: json.timeLeft || json.time_left || '',
      image: json.image || '',
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Giveaway {
    return new Giveaway({});
  }
}
