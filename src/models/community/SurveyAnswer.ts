import { BaseModel } from '../BaseModel';

/**
 * Represents an answer option in a Survey.
 */
export class SurveyAnswer extends BaseModel {
  id: string = '';
  text: string = '';
  votes: number = 0;
  voterIds: string[] = [];

  constructor(data: Partial<SurveyAnswer>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a SurveyAnswer object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): SurveyAnswer {
    if (BaseModel.usePreviousApi) {
      return SurveyAnswer.legacyFromJSON(json);
    }
    return SurveyAnswer.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): SurveyAnswer {
    return new SurveyAnswer({
      id: json.id || '',
      text: json.text || '',
      votes: json.votes || 0,
      voterIds: json.voterIds || [],
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): SurveyAnswer {
    return new SurveyAnswer({});
  }
}
