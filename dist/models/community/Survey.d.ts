import { User } from '../auth/User';
import { SurveyAnswer } from './SurveyAnswer';
/**
 * Represents a community Survey (Anket) in the aramizdakioyuncu.com platform.
 */
export declare class Survey {
    id: string;
    question: string;
    description?: string;
    options: SurveyAnswer[];
    author: User | null;
    createdAt: string;
    expiresAt?: string;
    totalVotes: number;
    hasVoted: boolean;
    myVoteId?: string;
    constructor(data: Partial<Survey>);
    /**
     * Helper to get percentage for a specific option.
     */
    getOptionPercentage(optionId: string): number;
    /**
     * Instantiates a Survey object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Survey;
}
