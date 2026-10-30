import { LoginResponse, UserResponse } from '../../models';
import { BaseMapper } from '../mappers/BaseMapper';

/**
 * Mapper for Authentication related V2 REST API responses.
 */
export class AuthMapperV2 extends BaseMapper {
  /**
   * Maps V2 Auth/Login response to LoginResponse model.
   */
  static mapLogin(raw: any): LoginResponse {
    const legacy = this.shouldReturnRaw<LoginResponse>(raw);
    if (legacy) return legacy;
    
    if (!raw) {
      return { user: { id: 0, username: '', displayName: '', avatar: '' }, token: '' } as LoginResponse;
    }

    const detail = raw.aciklamadetay || {};
    const token = detail.accessToken || raw.accessToken || '';
    
    const apiUser = raw.icerik?.user || {};
    const user: UserResponse = {
      id: this.toId(apiUser.id),
      username: apiUser.username || '',
      displayName: apiUser.displayName || '',
      avatar: this.toImageUrl(apiUser.avatar) || ''
    };

    return {
      user,
      token,
      refreshToken: detail.refreshToken,
      session: {
        id: 0,
        ip: '',
        device: '',
        date: ''
      }
    };
  }
}
