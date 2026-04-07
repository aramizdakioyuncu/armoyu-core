import { User } from '../auth/User';
import { SurveyAnswer } from './SurveyAnswer';

/**
 * Represents a community Survey (Anket) in the aramizdakioyuncu.com platform.
 */
export class Survey {
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
   * Instantiates a Survey object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Survey {
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
}
