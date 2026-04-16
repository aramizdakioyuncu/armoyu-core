import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';
import { SurveyAnswer } from './SurveyAnswer';

/**
 * Represents a community Survey (Anket) in the aramizdakioyuncu.com platform.
 */
export class Survey extends BaseModel {
  id: string = '';
  question: string = '';
  description?: string = '';
  options: SurveyAnswer[] = [];
  author: User | null = null;
  createdAt: string = '';
  expiresAt?: string = '';
  totalVotes: number = 0;
  
  // Current user's interaction state
  hasVoted: boolean = false;
  myVoteId?: string = '';

  constructor(data: Partial<Survey>) {
    super();
    Object.assign(this, data);
    this.totalVotes = this.options.reduce((sum, opt) => sum + opt.votes, 0);
  }

  /**
   * Helper to get percentage for a specific option.
   */
  getOptionPercentage(optionId: string): number {
    const option = this.options.find(o => o.id === optionId);
    if (!option || this.totalVotes === 0) return 0;
    return Math.round((option.votes / this.totalVotes) * 100);
  }

  /**
   * Instantiates a Survey object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Survey {
    if (BaseModel.usePreviousApi) {
      return Survey.legacyFromJSON(json);
    }
    return Survey.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Survey {
    return new Survey({
      id: json.id || '',
      question: json.question || '',
      description: json.description || '',
      options: Array.isArray(json.options) ? json.options.map((o: any) => SurveyAnswer.fromJSON(o)) : [],
      author: json.author ? User.fromJSON(json.author) : null,
      createdAt: json.createdAt || '',
      expiresAt: json.expiresAt || '',
      totalVotes: json.totalVotes || 0,
      hasVoted: json.hasVoted || false,
      myVoteId: json.myVoteId || '',
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Survey {
    return new Survey({});
  }
}
