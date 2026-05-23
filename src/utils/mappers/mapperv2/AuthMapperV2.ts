import { LoginResponse, UserResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

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

    const token = raw.accessToken || raw.token || '';
    
    return {
      user: {
        id: this.toNumber(raw.user?.id || raw.user_id),
        username: raw.user?.username || raw.username || '',
        displayName: raw.user?.display_name || raw.display_name || '',
        avatar: this.toImageUrl(raw.user?.avatar || raw.avatar) || ''
      } as UserResponse,
      token: token,
      session: raw.expiresIn ? {
        id: 0,
        ip: '',
        device: '',
        date: ''
      } : undefined
    };
  }
}
