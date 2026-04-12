import { User } from '../auth/User';
import { PollOption } from './PollOption';

/**
 * Represents a Poll/Survey in the platform.
 */
export class Poll {
  id: number = 0;
  owner: Partial<User> | null = null;
  question: string = '';
  media: any[] = [];
  status: number = 0;
  endDate: string = '';
  votingCount: number = 0;
  options: PollOption[] = [];
  didIVote: boolean = false;
  selectedOption: number | null = null;

  constructor(data: Partial<Poll>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Poll object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Poll {
    return new Poll({
      id: Number(json.survey_ID || 0),
      owner: json.survey_owner ? {
        id: json.survey_owner.owner_ID,
        displayName: json.survey_owner.owner_displayname,
        avatar: json.survey_owner.owner_avatar
      } : null,
      question: json.survey_question || '',
      media: Array.isArray(json.survey_media) ? json.survey_media : [],
      status: Number(json.survey_status || 0),
      endDate: json.survey_enddate || '',
      votingCount: Number(json.survey_votingCount || 0),
      options: Array.isArray(json.survey_options) 
        ? json.survey_options.map((o: any) => PollOption.fromJSON(o)) 
        : [],
      didIVote: Boolean(json.survey_didIVote),
      selectedOption: json.survey_selectedOption ? Number(json.survey_selectedOption) : null
    });
  }
}
