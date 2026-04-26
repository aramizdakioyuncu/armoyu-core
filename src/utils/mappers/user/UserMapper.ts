import { SearchUserResponse, BlockedUserResponse, RankingUserResponse, StaffUserResponse, InviteCodeCheckResponse, UserProfileDTO, User, BlockedUser, StaffUser, RankingUser } from '../../../models';
import { BaseMapper } from '../BaseMapper';
import { UserProfileMapper } from './UserProfileMapper';

/**
 * Main User Mapper (Facade).
 * Strictly separated by Page/Endpoint with specialized models matching the real API responses.
 */
export class UserMapper extends BaseMapper {
  /**
   * Specialized for Staff members.
   */
  static mapStaffUser(raw: any): StaffUser {
    if (!raw) return new StaffUser({} as any);
 
    return new StaffUser({
      displayName: raw.player_displayname || raw.adisoyadi || '',
      username: raw.player_username || raw.kullaniciadi || '',
      role: raw.player_role?.roleName || raw.gorevi || '',
      avatar: this.toImageUrl(raw.player_avatar?.media_minURL || raw.player_avatar?.media_URL || raw.oyuncuavatar) || ''
    });
  }

  /**
   * Specialized for Global Search results (Mixed: players, groups, schools).
   */
  static mapSearchUser(raw: any): SearchUserResponse {
    if (!raw) return {} as SearchUserResponse;

    return {
      id: this.toNumber(raw.ID),
      displayName: raw.Value || '',
      username: raw.username || '',
      avatar: this.toImageUrl(raw.avatar) || '',
      type: raw.turu || ''
    };
  }

  /**
   * Specialized for Blocked Users list.
   */
  static mapBlockedUser(raw: any): BlockedUser {
    if (!raw) return new BlockedUser({} as any);

    return new BlockedUser({
      blockId: this.toNumber(raw.engel_ID),
      userId: this.toNumber(raw.engel_kimeID),
      username: raw.engel_kadi || '',
      displayName: raw.engel_kime || '',
      avatar: this.toImageUrl(raw.engel_avatar) || '',
      blockDate: raw.engel_zaman || ''
    });
  }

  /**
   * Specialized for XP Ranking list.
   */
  static mapXpRankingUser(raw: any): RankingUser {
    if (!raw) return new RankingUser({} as any);

    return new RankingUser({
      rank: this.toNumber(raw.oyuncusiralama),
      id: this.toNumber(raw.oyuncuID),
      displayName: raw.oyuncuadsoyad || '',
      username: raw.oyuncukullaniciadi || '',
      avatar: this.toImageUrl(raw.oyuncuavatar) || '',
      value: this.toNumber(raw.oyuncuseviyesezonlukxp)
    });
  }

  /**
   * Specialized for Friends list.
   */
  static mapFriendUser(raw: any): RankingUser {
    if (!raw) return new RankingUser({} as any);

    return new RankingUser({
      rank: this.toNumber(raw['#']),
      id: this.toNumber(raw.oyuncuID),
      displayName: raw.oyuncuad || '',
      username: raw.oyuncukullaniciad || '',
      avatar: this.toImageUrl(raw.oyuncuavatar) || '',
      value: this.toNumber(raw.oyunculevel)
    });
  }

  /**
   * Specialized for POP Ranking list.
   */
  static mapPopRankingUser(raw: any): RankingUser {
    if (!raw) return new RankingUser({} as any);

    return new RankingUser({
      rank: this.toNumber(raw.oyuncusiralama),
      id: this.toNumber(raw.oyuncuID),
      displayName: raw.oyuncuadsoyad || '',
      username: raw.oyuncukullaniciadi || '',
      avatar: this.toImageUrl(raw.oyuncuavatar) || '',
      value: this.toNumber(raw.oyuncupop)
    });
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

  /**
   * Full User Profile mapping.
   */
  static mapProfile(raw: any): User {
    return UserProfileMapper.mapProfile(raw);
  }

  // --- List Mappers ---

  static mapStaffList(rawList: any[]): StaffUser[] {
    return (rawList || []).map(u => this.mapStaffUser(u));
  }

  static mapSearchList(rawList: any[]): SearchUserResponse[] {
    return (rawList || []).map(u => this.mapSearchUser(u));
  }

  static mapBlockedList(rawList: any[]): BlockedUser[] {
    return (rawList || []).map(u => this.mapBlockedUser(u));
  }

  static mapXpRankingList(rawList: any[]): RankingUser[] {
    return (rawList || []).map(u => this.mapXpRankingUser(u));
  }

  static mapPopRankingList(rawList: any[]): RankingUser[] {
    return (rawList || []).map(u => this.mapPopRankingUser(u));
  }

  /**
   * Specialized for Invitation list.
   */
  static mapInvitation(raw: any): any {
    if (!raw) return {};

    return {
      rank: this.toNumber(raw['#']),
      id: this.toNumber(raw.oyuncu_ID),
      displayName: raw.oyuncu_displayname || '',
      username: raw.oyuncu_username || '',
      avatar: this.toImageUrl(raw.oyuncu_avatar) || '',
      date: raw.oyuncu_zaman || '',
      verified: raw.oyuncu_dogrulama === true
    };
  }

  static mapInvitationList(rawList: any[]): any[] {
    return (rawList || []).map(u => this.mapInvitation(u));
  }
}
