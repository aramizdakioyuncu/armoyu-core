/**
 * Represents a score/entry in a project's leaderboard.
 */
export class ProjectScore {
  projectId: string = '';
  playerName: string = '';
  score: number = 0;

  constructor(data: Partial<ProjectScore>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a ProjectScore object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): ProjectScore {
    return new ProjectScore({
      projectId: String(json.proje_ID || ''),
      playerName: json.proje_oyuncu || '',
      score: Number(json.proje_skor || 0)
    });
  }
}
