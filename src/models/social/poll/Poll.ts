import { BaseModel } from '../../BaseModel';
import { PollOption } from './PollOption';

/**
 * Represents a Social Poll.
 */
export class Poll extends BaseModel {
  id: string = '';
  question: string = '';
  options: PollOption[] = [];
  totalVotes: number = 0;
  expiresAt: string = '';
  isClosed: boolean = false;
  allowMultiple: boolean = false;

  constructor(data: Partial<Poll>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Poll object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Poll {
    if (BaseModel.usePreviousApi) {
      return Poll.legacyFromJSON(json);
    }
    return Poll.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Poll {
    return new Poll({
      id: String(json.id || json.anketid || ''),
      question: json.question || json.soru || '',
      options: Array.isArray(json.options || json.secenekler) ? (json.options || json.secenekler).map((o: any) => PollOption.fromJSON(o)) : [],
      totalVotes: Number(json.totalVotes || json.toplam_oy || 0),
      expiresAt: json.expiresAt || json.bitis_tarih || '',
      isClosed: json.isClosed === true || json.durum === 0 || false,
      allowMultiple: json.allowMultiple === true || json.coklu_secim === 1 || false
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Poll {
    return new Poll({});
  }
}
