/**
 * Represents an answer option in a Survey.
 */
export class SurveyAnswer {
  id: string = '';
  text: string = '';
  votes: number = 0;
  voterIds: string[] = [];

  constructor(data: Partial<SurveyAnswer>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a SurveyAnswer object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): SurveyAnswer {
    return new SurveyAnswer({
      id: json.id || '',
      text: json.text || '',
      votes: json.votes || 0,
      voterIds: json.voterIds || [],
    });
  }
}
