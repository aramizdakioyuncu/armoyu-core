import { BaseService } from '../services/BaseService';
import { LoginResponse, ServiceResponse, User, PasswordResetPreference } from '../models';
import { AuthMapperV2 } from '../utils/mappersv2/AuthMapperV2';
import { UserMapper } from '../utils/mappers';

/**
 * Modern V2 (CURRENT) implementation for AuthService.
 */
export class AuthServiceV2 extends BaseService {
  /**
   * Log in with username and password (V2).
   */
  async login(username: string, sifre: string): Promise<ServiceResponse<LoginResponse>> {
    try {
      const response = await this.client.post<any>('/v1/auth/login', {
        username,
        password: sifre
      });
      this.handle<any>(response); // Validate status and response structure
      const mapped = AuthMapperV2.mapLogin(response);

      if (mapped.token) {
        this.client.setAuthToken(mapped.token);
        this.client.setRefreshToken(mapped.refreshToken ?? null);
      }

      return this.createSuccess(mapped, 'Giriş Başarılı');
    } catch (error: any) {
      this.logger.error('[AuthServiceV2] Login failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Register a new account (V2).
   */
  async register(params: any): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.client.post<any>('/v1/auth/register', {
        username: params.username || '',
        firstName: params.firstName || '',
        lastName: params.lastName || '',
        email: params.email || '',
        password: params.password || '',
        inviteCode: params.inviteCode || undefined
      });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV2] Registration failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Get current user profile (V2).
   */
  async me(): Promise<ServiceResponse<User>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/auth/me');
      const icerik = this.handle<any>(response);
      const mapped = UserMapper.mapProfile(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV2] Failed to fetch current profile:', error.message);
      return this.createError(error.message);
    }
  }

  /** E-posta doğrulandı mı (oturum gerekir) */
  async emailVerification(): Promise<ServiceResponse<{ verified: boolean; email: string | null }>> {
    try {
      const response = await this.client.get<any>('/v1/auth/email-verification');
      const icerik = this.handle<any>(response);
      return this.createSuccess({ verified: !!icerik?.verified, email: icerik?.email ?? null }, response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  /** Doğrulama bağlantısını yeniden gönderir (oturum gerekir) */
  async resendVerification(): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.client.post<any>('/v1/auth/resend-verification', {});
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  /** E-postadaki bağlantının token'ıyla doğrular */
  async verifyEmail(token: string): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.client.post<any>('/v1/auth/verify-email', { token });
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  /**
   * Log out and clear session (V2).
   */
  async logout(): Promise<ServiceResponse<boolean>> {
    try {
      await this.client.post<any>('/v1/auth/logout', {});
    } catch (error) {
      // Ignore network errors on logout
    }
    this.client.setAuthToken('');
    this.client.setRefreshToken(null);
    return this.createSuccess(true, 'Çıkış Yapıldı');
  }

  /**
   * Request password reset code (V2).
   */
  async forgotPassword(params: { username: string, email: string, birthday: string, preference: PasswordResetPreference | 'email' | 'sms' }): Promise<ServiceResponse<boolean>> {
    try {
      let birthYear = params.birthday || '';
      if (birthYear.includes('.')) {
        const parts = birthYear.split('.');
        birthYear = parts[parts.length - 1];
      } else if (birthYear.includes('-')) {
        const parts = birthYear.split('-');
        if (parts[0].length === 4) {
          birthYear = parts[0];
        } else {
          birthYear = parts[parts.length - 1];
        }
      }

      const response = await this.client.post<any>('/v1/auth/forgot-password', {
        email: params.email,
        dogum_yili: birthYear,
        tercih: params.preference
      });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV2] Forgot password request failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Verify code and reset password (V2).
   */
  async verifyPasswordReset(params: { username: string, email: string, birthday: string, code: string, newPassword: any }): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.client.post<any>('/v1/auth/reset-password', {
        email: params.email,
        code: params.code,
        new_password: params.newPassword
      });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV2] Password reset verification failed:', error.message);
      return this.createError(error.message);
    }
  }
}
