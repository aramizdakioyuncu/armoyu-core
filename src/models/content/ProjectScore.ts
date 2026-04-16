import { BaseModel } from '../BaseModel';

/**
 * Represents a score/entry in a project's leaderboard.
 */
export class ProjectScore extends BaseModel {
  projectId: string = '';
  playerName: string = '';
  score: number = 0;

  constructor(data: Partial<ProjectScore>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a ProjectScore object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): ProjectScore {
    if (BaseModel.usePreviousApi) {
      return ProjectScore.legacyFromJSON(json);
    }
    return ProjectScore.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): ProjectScore {
    return new ProjectScore({
      projectId: String(json.proje_ID || ''),
      playerName: json.proje_oyuncu || '',
      score: Number(json.proje_skor || 0)
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): ProjectScore {
    return new ProjectScore({});
  }
}
