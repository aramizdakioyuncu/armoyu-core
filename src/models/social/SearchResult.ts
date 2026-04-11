/**
 * Represents a generic search result from the ARMOYU global search API.
 */
export class SearchResult {
  id: number = 0;
  title: string = '';
  type: string = ''; // 'oyuncu', 'takim', 'grup', etc.
  username?: string;
  avatar: string = '';
  gender?: string;
  rank: number = 0;

  constructor(data: Partial<SearchResult>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a SearchResult object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): SearchResult {
    return new SearchResult({
      id: Number(json.ID || json.id || 0),
      title: json.Value || json.title || '',
      type: json.turu || json.type || '',
      username: json.username || '',
      avatar: json.avatar || '',
      gender: json.cins || '',
      rank: Number(json['#'] || 0)
    });
  }

  /**
   * Checks if the result is a player.
   */
  isPlayer(): boolean {
    return this.type === 'oyuncu';
  }

  /**
   * Checks if the result is a team.
   */
  isTeam(): boolean {
    return this.type === 'takim';
  }
}
