/**
 * Represents an answer option in a Survey.
 */
export declare class SurveyAnswer {
    id: string;
    text: string;
    votes: number;
    voterIds: string[];
    constructor(data: Partial<SurveyAnswer>);
    /**
     * Instantiates a SurveyAnswer object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): SurveyAnswer;
}
