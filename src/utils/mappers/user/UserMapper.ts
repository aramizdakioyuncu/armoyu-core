import { SearchUserResponse, BlockedUserResponse, RankingUserResponse, StaffUserResponse, InviteCodeCheckResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';
import { UserProfileMapper } from './UserProfileMapper';

/**
 * Main User Mapper (Facade).
 * Now strictly separated by Page/Endpoint with specialized models.
 */
export class UserMapper extends BaseMapper {
  /**
   * Specialized for Staff members.
   */
  static mapStaffUser(raw: any): StaffUserResponse {
    if (!raw) return {} as StaffUserResponse;

    return {
      displayName: raw.player_displayname || raw.adisoyadi || '',
      username: raw.player_username || raw.kullaniciadi || '',
      role: raw.player_role?.roleName || raw.gorevi || '',
      avatar: this.toImageUrl(raw.player_avatar?.media_minURL || raw.player_avatar?.media_URL || raw.oyuncuavatar) || ''
    };
  }

  /**
   * Specialized for Search results.
   */
  static mapSearchUser(raw: any): SearchUserResponse {
    if (!raw) return {} as SearchUserResponse;

    return {
      id: this.toNumber(raw.ID),
      username: raw.kullaniciadi || '',
      displayName: raw.adisoyadi || '',
      avatar: this.toImageUrl(raw.oyuncuavatar) || '',
      level: this.toNumber(raw.seviye),
      points: this.toNumber(raw.para),
      popularity: this.toNumber(raw.populer)
    };
  }

  /**
   * Specialized for Blocked Users list.
   */
  static mapBlockedUser(raw: any): BlockedUserResponse {
    if (!raw) return {} as BlockedUserResponse;

    return {
      blockId: this.toNumber(raw.engel_ID),
      userId: this.toNumber(raw.engel_kimeID),
      username: raw.engel_kadi || '',
      displayName: raw.engel_kime || '',
      avatar: this.toImageUrl(raw.engel_avatar) || '',
      blockDate: raw.engel_zaman || ''
    };
  }

  /**
   * Specialized for Ranking list.
   */
  static mapRankingUser(raw: any): RankingUserResponse {
    if (!raw) return {} as RankingUserResponse;

    return {
      rank: this.toNumber(raw.oyuncusiralama),
      id: this.toNumber(raw.oyuncuID),
      displayName: raw.oyuncuadsoyad || '',
      username: raw.oyuncukullaniciad || '',
      avatar: this.toImageUrl(raw.oyuncuavatar) || '',
      value: this.toNumber(raw.oyuncupara || raw.oyuncupopuler || raw.oyuncuxp)
    };
  }

  static mapProfile(raw: any) {
    return UserProfileMapper.mapProfile(raw);
  }

  /**
   * Specialized for Invite Code Check.
   */
  static mapInviteCodeCheck(raw: any): InviteCodeCheckResponse {
    if (!raw) return {} as InviteCodeCheckResponse;

    return {
      userId: this.toNumber(raw.oyuncu_ID),
      displayName: raw.oyuncu_displayName || '',
      avatar: this.toImageUrl(raw.oyuncu_avatar) || ''
    };
  }

  static mapSearchList(rawList: any[]): SearchUserResponse[] {
    return (rawList || []).map(u => this.mapSearchUser(u));
  }

  static mapBlockedList(rawList: any[]): BlockedUserResponse[] {
    return (rawList || []).map(u => this.mapBlockedUser(u));
  }

  static mapRankingList(rawList: any[]): RankingUserResponse[] {
    return (rawList || []).map(u => this.mapRankingUser(u));
  }

  static mapStaffList(rawList: any[]): StaffUserResponse[] {
    return (rawList || []).map(u => this.mapStaffUser(u));
  }
}
