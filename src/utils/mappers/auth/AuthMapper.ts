import { LoginResponse, MeResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Authentication related API responses.
 * Strictly specialized for the Login and Identity pages.
 */
export class AuthMapper extends BaseMapper {
  /**
   * Specifically for the Login response.
   */
  static mapLogin(raw: any, token?: string): LoginResponse {
    const legacy = this.shouldReturnRaw<LoginResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return { user: { id: 0, username: '', displayName: '', avatar: '' }, token: '' } as LoginResponse;

    // The legacy API often returns the user data directly in 'icerik'
    const userRaw = raw.user || raw;

    return {
      user: {
        id: this.toNumber(userRaw.ID || userRaw.playerID || userRaw.oyuncuID),
        username: userRaw.kullaniciadi || userRaw.username || '',
        displayName: userRaw.adsoyad || userRaw.displayName || userRaw.kullaniciadi || '',
        avatar: this.toImageUrl(userRaw.oyuncuavatar || userRaw.avatar?.media_URL || userRaw.avatar) || '',
        email: userRaw.eposta || userRaw.detailInfo?.email || '',
        isSocial: !!(userRaw.sosyalhesap || userRaw.socailAccounts)
      },
      token: token || raw.token || '',
      session: {
        id: this.toNumber(raw.oturum_ID),
        ip: raw.oturum_IP || '',
        device: raw.oturum_cihaz || '',
        date: raw.oturum_zaman || raw.detailInfo?.lastloginDate || ''
      }
    };
  }

  /**
   * Specifically for the 'Me' / Identity check page.
   */
  static mapMe(raw: any): MeResponse {
    const legacy = this.shouldReturnRaw<MeResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as MeResponse;

    return {
      id: this.toNumber(raw.ID || raw.playerID || raw.oyuncuID),
      username: raw.kullaniciadi || raw.username,
      displayName: raw.adsoyad || raw.displayName,
      avatar: this.toImageUrl(raw.oyuncuavatar || raw.avatar?.media_URL || raw.avatar),
      status: raw.durum_notu || ''
    };
  }
}
