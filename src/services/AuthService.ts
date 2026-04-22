import { LoginResponse, ServiceResponse, UserProfileResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { AuthMapper, UserMapper } from '../utils/mappers';

/**
 * Service for authentication, login, and registration.
 * Handles the special case of legacy login response where token is in 'aciklama' or 'aciklamadetay.token'.
 */
export class AuthService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Log in with username and password.
   */
  async login(username: string, sifre: string): Promise<ServiceResponse<LoginResponse>> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', sifre);

    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/'), formData);
      const icerik = this.handle<any>(response);

      const aciklamaToken = response?.aciklama || '';
      const isAciklamaTokenValid = aciklamaToken.length > 50 && !aciklamaToken.includes(' ');
      const token = response?.aciklamadetay?.token || (isAciklamaTokenValid ? aciklamaToken : '');
      const mapped = AuthMapper.mapLogin(icerik, token);

      if (mapped.token) {
        this.client.setToken(mapped.token);
      }

      return this.createSuccess(mapped, 'Giriş Başarılı');
    } catch (error: any) {
      this.logger.error('[AuthService] Login failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Register a new account.
   */
  async register(params: any): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('username', params.username || '');
      formData.append('ad', params.firstName || '');
      formData.append('soyad', params.lastName || '');
      formData.append('eposta', params.email || '');
      formData.append('sifre', params.password || '');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/kayit-ol/'), formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Registration failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get current user profile.
   */
  async me(): Promise<ServiceResponse<UserProfileResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/0/0/0/'), new FormData());
      const icerik = this.handle<any>(response);
      const mapped = UserMapper.mapProfile(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Failed to fetch current profile:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Log out and clear session.
   */
  async logout(): Promise<ServiceResponse<boolean>> {
    try {
      // In legacy API, logout is often just client-side token clear, 
      // but we send a request to /0/0/cikis/ if supported
      await this.client.post<any>(this.resolveBotPath('/0/0/cikis/'), new FormData());
    } catch (error) {
      // Ignore network errors on logout
    }
    this.client.setToken('');
    return this.createSuccess(true, 'Çıkış Yapıldı');
  }

  /**
   * Request password reset code.
   */
  async forgotPassword(params: { username: string, email: string, birthday: string, preference: string }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciad', params.username);
      formData.append('eposta', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('tercih', params.preference);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sifremi-unuttum/'), formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Forgot password request failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Verify code and reset password.
   */
  async verifyPasswordReset(params: { username: string, email: string, birthday: string, code: string, newPassword: any }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciad', params.username);
      formData.append('eposta', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('kod', params.code);
      formData.append('yenisifre', params.newPassword);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sifremi-unuttum-onayla/'), formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Password reset verification failed:', error);
      return this.createError(error.message);
    }
  }
}
