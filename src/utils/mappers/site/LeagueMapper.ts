import { LeagueStandingResponse } from '../../../models';

export class LeagueMapper {
  static mapStanding(item: any): LeagueStandingResponse {
    return {
      rank: Number(item['#']) || 0,
      teamName: item.takimadi || '',
      logo: item.logo || null,
      played: Number(item.oynananmac) || 0,
      average: Number(item.avaraj) || 0,
      points: Number(item.puan) || 0
    };
  }

  static mapStandingList(items: any[]): LeagueStandingResponse[] {
    if (!Array.isArray(items)) return [];
    return items.map(item => this.mapStanding(item));
  }
}
