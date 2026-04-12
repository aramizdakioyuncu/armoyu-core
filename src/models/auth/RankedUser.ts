/**
 * Represents a user in the context of leaderboards/rankings.
 * This class maps directly to the structure returned by XP and POP ranking APIs.
 */
export class RankedUser {
  id: number = 0;
  displayName: string = '';
  username: string = '';
  avatar: string = '';
  level: number = 1;
  xp: number = 0;
  seasonalXp: number = 0;
  popScore: number = 0;

  constructor(data: Partial<RankedUser>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a RankedUser object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): RankedUser {
    return new RankedUser({
      id: Number(json.oyuncuID || 0),
      displayName: json.oyuncuadsoyad || '',
      username: json.oyuncukullaniciadi || '',
      avatar: json.oyuncuavatar || '',
      level: Number(json.oyuncuseviye || 1),
      xp: Number(json.oyuncuseviyexp || 0),
      seasonalXp: Number(json.oyuncuseviyesezonlukxp || 0),
      popScore: Number(json.oyuncupop || 0)
    });
  }
}
