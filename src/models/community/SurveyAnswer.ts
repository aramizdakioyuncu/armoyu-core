export class SurveyAnswer {
  id?: string | number;
  text?: string;
  votes?: number;

  constructor(data?: Partial<SurveyAnswer>) {
    Object.assign(this, data);
  }
}
