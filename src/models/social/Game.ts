/**
 * Represents a Game in the ARMOYU ecosystem.
 */
export class Game {
  id: number = 0;
  name: string = '';
  shortName: string = '';
  slug: string = '';
  logo: string = '';
  banner: string = '';
  score: number = 0;
  money: number = 0;
  
  // Optional clan/role info if part of a list (like popularGames)
  roleName?: string;
  clanName?: string;
  clanTag?: string;

  constructor(data: Partial<Game>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Game object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Game {
    const logoData = json.game_logo || {};
    const roleData = json.game_role || {};
    const clanData = json.game_clan || {};

    return new Game({
      id: Number(json.game_ID || json.id || 0),
      name: json.game_name || json.name || '',
      shortName: json.game_shortName || json.shortName || '',
      slug: json.game_URL || json.slug || '',
      logo: logoData.media_URL || logoData.media_bigURL || '',
      banner: logoData.media_bigURL || '',
      score: Number(json.game_score || 0),
      money: Number(json.game_money || 0),
      roleName: roleData.role_name || '',
      clanName: clanData.clan_name || '',
      clanTag: clanData.clan_shortName || ''
    });
  }
}
