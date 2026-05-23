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
    
    // Decode JWT to extract user information
    let user: UserResponse = { id: 0, username: '', displayName: '', avatar: '' };
    let sessionId = 0;
    
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = parts[1];
          const decodedStr = typeof Buffer !== 'undefined'
            ? Buffer.from(payload, 'base64').toString('utf8')
            : atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
          const jwtPayload = JSON.parse(decodedStr);
          
          user = {
            id: this.toNumber(jwtPayload.sub),
            username: jwtPayload.username || '',
            displayName: jwtPayload.username || '',
            avatar: this.toImageUrl(jwtPayload.avatar) || ''
          };
          sessionId = this.toNumber(jwtPayload.session_id);
        }
      } catch (e) {
        // Fallback if decode fails
      }
    }

    return {
      user,
      token,
      session: {
        id: sessionId,
        ip: '',
        device: '',
        date: ''
      }
    };
  }
}
