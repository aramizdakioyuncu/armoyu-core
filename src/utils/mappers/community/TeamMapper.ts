import { TeamResponse, TeamMemberResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Teams (Takımlar) related API responses.
 * Strict mapping: Targeting exact legacy fields for V1.
 */
export class TeamMapper extends BaseMapper {
  static mapTeamMember(raw: any): TeamMemberResponse {
    if (!raw) return {} as TeamMemberResponse;

    return {
      id: this.toNumber(raw.oyuncuid),
      displayName: raw.oyuncuadsoyad || '',
      username: raw.oyuncukullaniciad || '',
      avatar: this.toImageUrl(raw.oyuncuavatar) || '',
      role: raw.takim_rutbe || '',
      joinDate: raw.takim_katilmatarih || ''
    };
  }

  static mapTeam(raw: any): TeamResponse {
    const legacy = this.shouldReturnRaw<TeamResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as TeamResponse;

    return {
      id: this.toNumber(raw.takim_ID),
      name: raw.takim_adi,
      logo: this.toImageUrl(raw.takim_logo)
    };
  }

  static mapTeamList(rawList: any[]): TeamResponse[] {
    return (rawList || []).map(item => this.mapTeam(item));
  }
}
