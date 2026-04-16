import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';

/**
 * Represents an entry in a Leaderboard.
 */
export class LeaderboardEntry extends BaseModel {
  user: User | null = null;
  score: number = 0;
  rank: number = 0;

  constructor(data: Partial<LeaderboardEntry>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a LeaderboardEntry object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): LeaderboardEntry {
    if (BaseModel.usePreviousApi) {
      return LeaderboardEntry.legacyFromJSON(json);
    }
    return LeaderboardEntry.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): LeaderboardEntry {
    return new LeaderboardEntry({
      user: json.user ? User.fromJSON(json.user) : (json.oyuncu ? User.fromJSON(json.oyuncu) : null),
      score: Number(json.score || json.puan || 0),
      rank: Number(json.rank || json.sira || 0)
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): LeaderboardEntry {
    return new LeaderboardEntry({});
  }
}

/**
 * Represents a Leaderboard.
 */
export class Leaderboard extends BaseModel {
  id: string = '';
  title: string = '';
  entries: LeaderboardEntry[] = [];
  lastUpdated: string = '';

  constructor(data: Partial<Leaderboard>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Leaderboard object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Leaderboard {
    if (BaseModel.usePreviousApi) {
      return Leaderboard.legacyFromJSON(json);
    }
    return Leaderboard.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Leaderboard {
    return new Leaderboard({
      id: String(json.id || json.listeid || ''),
      title: json.title || json.baslik || '',
      entries: Array.isArray(json.entries || json.liste) ? (json.entries || json.liste).map((e: any) => LeaderboardEntry.fromJSON(e)) : [],
      lastUpdated: json.lastUpdated || json.guncelleme || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Leaderboard {
    return new Leaderboard({});
  }
}
