/**
 * Represents a Platform Rule (Kural).
 */
export class Rule {
  id: number = 0;
  text: string = '';
  penalty: string = '';
  createdAt: string = '';
  subArticle: string | null = null;

  constructor(data: Partial<Rule>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Rule object from a JSON object.
   * Handles both clean fields and raw ARMOYU API keys.
   */
  static fromJSON(json: any): Rule {
    return new Rule({
      id: json.id || json.kuralid || 0,
      text: json.text || json.kuralicerik || '',
      penalty: json.penalty || json.cezabaslangic || '',
      createdAt: json.createdAt || json.cezakoyulmatarihi || '',
      subArticle: json.subArticle || json.kuralaltmadde || null
    });
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
