import { BaseModel } from '../BaseModel';

/**
 * Represents a Platform Rule (Kural).
 */
export class Rule extends BaseModel {
  id: number = 0;
  text: string = '';
  penalty: string = '';
  createdAt: string = '';
  subArticle: string | null = null;

  constructor(data: Partial<Rule>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Rule object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Rule {
    if (BaseModel.usePreviousApi) {
      return Rule.legacyFromJSON(json);
    }
    return Rule.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Rule {
    return new Rule({
      id: json.id || json.kuralid || 0,
      text: json.text || json.kuralicerik || '',
      penalty: json.penalty || json.cezabaslangic || '',
      createdAt: json.createdAt || json.cezakoyulmatarihi || '',
      subArticle: json.subArticle || json.kuralaltmadde || null
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Rule {
    return new Rule({});
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      penalty: this.penalty,
      createdAt: this.createdAt,
      subArticle: this.subArticle
    };
  }
}
