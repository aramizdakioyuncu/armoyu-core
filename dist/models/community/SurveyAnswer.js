"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyAnswer = void 0;
/**
 * Represents an answer option in a Survey.
 */
class SurveyAnswer {
    constructor(data) {
        this.id = '';
        this.text = '';
        this.votes = 0;
        this.voterIds = [];
        Object.assign(this, data);
    }
    /**
     * Instantiates a SurveyAnswer object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new SurveyAnswer({
            id: json.id || '',
            text: json.text || '',
            votes: json.votes || 0,
            voterIds: json.voterIds || [],
        });
    }
}
exports.SurveyAnswer = SurveyAnswer;
