"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = void 0;
const User_1 = require("../auth/User");
const SurveyAnswer_1 = require("./SurveyAnswer");
/**
 * Represents a community Survey (Anket) in the aramizdakioyuncu.com platform.
 */
class Survey {
    constructor(data) {
        this.id = '';
        this.question = '';
        this.description = '';
        this.options = [];
        this.author = null;
        this.createdAt = '';
        this.expiresAt = '';
        this.totalVotes = 0;
        // Current user's interaction state
        this.hasVoted = false;
        this.myVoteId = '';
        Object.assign(this, data);
        this.totalVotes = this.options.reduce((sum, opt) => sum + opt.votes, 0);
    }
    /**
     * Helper to get percentage for a specific option.
     */
    getOptionPercentage(optionId) {
        const option = this.options.find(o => o.id === optionId);
        if (!option || this.totalVotes === 0)
            return 0;
        return Math.round((option.votes / this.totalVotes) * 100);
    }
    /**
     * Instantiates a Survey object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Survey({
            id: json.id || '',
            question: json.question || '',
            description: json.description || '',
            options: Array.isArray(json.options) ? json.options.map((o) => SurveyAnswer_1.SurveyAnswer.fromJSON(o)) : [],
            author: json.author ? User_1.User.fromJSON(json.author) : null,
            createdAt: json.createdAt || '',
            expiresAt: json.expiresAt || '',
            totalVotes: json.totalVotes || 0,
            hasVoted: json.hasVoted || false,
            myVoteId: json.myVoteId || '',
        });
    }
}
exports.Survey = Survey;
