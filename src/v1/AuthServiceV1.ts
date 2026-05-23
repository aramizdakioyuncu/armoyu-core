import { BaseService } from '../services/BaseService';
import { LoginResponse, ServiceResponse, User, PasswordResetPreference } from '../models';
import { AuthMapper, UserMapper } from '../utils/mappers';

/**
 * Legacy V1 (OLD) implementation for AuthService.
 */
export class AuthServiceV1 extends BaseService {
  /**
   * Log in with username and password (V1).
   */
  async login(username: string, sifre: string): Promise<ServiceResponse<LoginResponse>> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', sifre);

    try {
      const response = await this.client.post<any>('/0/0/0/', formData);
      const icerik = this.handle<any>(response);

      const aciklamaToken = response?.aciklama || '';
      const isAciklamaTokenValid = aciklamaToken.length > 50 && !aciklamaToken.includes(' ');
      const token = response?.aciklamadetay?.token || (isAciklamaTokenValid ? aciklamaToken : '');
      const mapped = AuthMapper.mapLogin(icerik, token);

      if (!mapped.user.id || mapped.user.id === 0) {
        throw new Error('Kullanıcı adı veya şifre hatalı (Sistem geçerli bir kullanıcı verisi alamadı).');
      }

      if (mapped.token) {
        this.client.setAuthToken(mapped.token);
      }

      return this.createSuccess(mapped, 'Giriş Başarılı');
    } catch (error: any) {
      this.logger.error('[AuthServiceV1] Login failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Register a new account (V1).
   */
  async register(params: any): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('username', params.username || '');
      formData.append('ad', params.firstName || '');
      formData.append('soyad', params.lastName || '');
      formData.append('eposta', params.email || '');
      formData.append('sifre', params.password || '');

      if (params.inviteCode) {
        formData.append('davetkodu', params.inviteCode);
      }

      const response = await this.client.post<any>('/0/0/kayit-ol/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV1] Registration failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get current user profile (V1).
   */
  async me(): Promise<ServiceResponse<User>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/0/0/0/', new FormData());
      const icerik = this.handle<any>(response);
      const mapped = UserMapper.mapProfile(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV1] Failed to fetch current profile:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Log out and clear session (V1).
   */
  async logout(): Promise<ServiceResponse<boolean>> {
    try {
      await this.client.post<any>('/0/0/cikis/', new FormData());
    } catch (error) {
      // Ignore network errors on logout
    }
    this.client.setAuthToken('');
    return this.createSuccess(true, 'Çıkış Yapıldı');
  }

  /**
   * Request password reset code (V1).
   */
  async forgotPassword(params: { username: string, email: string, birthday: string, preference: PasswordResetPreference | 'email' | 'sms' }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciad', params.username);
      formData.append('eposta', params.email);
      formData.append('dogumtarihi', params.birthday);

      const v1Preference = params.preference === PasswordResetPreference.EMAIL ? 'eposta' : params.preference;
      formData.append('tercih', v1Preference);

      const response = await this.client.post<any>('/0/0/sifremi-unuttum/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV1] Forgot password request failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Verify code and reset password (V1).
   */
  async verifyPasswordReset(params: { username: string, email: string, birthday: string, code: string, newPassword: any }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciad', params.username);
      formData.append('eposta', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('kod', params.code);
      formData.append('yenisifre', params.newPassword);

      const response = await this.client.post<any>('/0/0/sifremi-unuttum-onayla/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthServiceV1] Password reset verification failed:', error);
      return this.createError(error.message);
    }
  }
}
