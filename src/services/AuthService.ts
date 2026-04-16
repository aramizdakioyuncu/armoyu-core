import { User } from '../models/auth/User';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { LoginResponse } from '../models/auth/LoginResponse';
import { MeResponse } from '../models/auth/MeResponse';

/**
 * Service for managing user authentication, registration, and session lifecycle.
 * @checked 2026-04-12
 */
export class AuthService extends BaseService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Authenticate a user with username and password.
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    if (this.isAuthenticated()) {
      return this.createError('Zaten giriş yapılmış.') as any;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      // Compatibility with legacy ARMOYU v0
      formData.append('kullaniciadi', username);
      formData.append('parola', password);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/0'), formData);

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      const icerik = this.handle<any>(data);

      if (!icerik) {
        return this.createError('API Hatası: Kullanıcı bilgileri alınamadı.') as any;
      }

      // ARMOYU Login logic: Token is inside the 'aciklama' field (as a string or object)
      let sessionToken = '';
      if (typeof data.aciklama === 'string') {
        const isStrictToken = /^[a-zA-Z0-9.\-_=]+$/.test(data.aciklama);
        if (isStrictToken) {
          sessionToken = data.aciklama;
        }
      } else if (data.aciklama && typeof data.aciklama === 'object') {
        sessionToken = data.aciklama.token || data.aciklama.session_token || '';
      }

      this.currentUser = icerik;
      this.token = sessionToken || icerik?.token || icerik?.session_token || null;
      
      if (this.token) {
        this.client.setToken(this.token);
      }

      return this.createSuccess({ user: this.currentUser!, token: this.token! }, data.aciklama) as any;
    } catch (error: any) {
      this.logger.error('[AuthService] Login failed:', error);
      return this.createError(error.message) as any;
    }
  }

  /**
   * Register a new user (Legacy).
   */
  async register(params: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('ad', params.firstName);
      formData.append('soyad', params.lastName);
      formData.append('email', params.email);
      formData.append('parola', params.password);
      formData.append('parolakontrol', params.password);

      const response = await this.client.post<any>(this.resolveBotPath('/kayit-ol/0/0/0/0/'), formData);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      return this.createSuccess(Number(data.durum) === 1, data.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Registration failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Request a password reset (Legacy).
   */
  async forgotPassword(params: {
    username: string;
    email: string;
    birthday: string;
    preference: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('email', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('sifirlamatercihi', params.preference);

      const response = await this.client.post<any>(this.resolveBotPath('/sifremi-unuttum/0/0/0/0/'), formData);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      return this.createSuccess(Number(data.durum) === 1, data.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Forgot password request failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Verify password reset and set new password (Legacy).
   */
  async verifyPasswordReset(params: {
    username: string;
    email: string;
    birthday: string;
    code: string;
    newPassword: string;
  }): Promise<ServiceResponse<boolean>> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('email', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('onaykodu', params.code);
      formData.append('yeniparola', params.newPassword);
      formData.append('yeniparolakontrol', params.newPassword);

      const response = await this.client.post<any>(this.resolveBotPath('/sifremi-unuttum-dogrula/0/0/0/0/'), formData);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      return this.createSuccess(Number(data.durum) === 1, data.aciklama);
    } catch (error: any) {
      this.logger.error('[AuthService] Verify password reset failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Logout the current user.
   */
  async logout(): Promise<ServiceResponse<void>> {
    try {
      await this.client.post('/auth/logout', {});
    } catch (error: any) {
      this.logger.error('[AuthService] Logout API call failed:', error);
    } finally {
      this.currentUser = null;
      this.token = null;
      this.client.setToken(null);
    }
    return this.createSuccess(undefined, 'Çıkış yapıldı.');
  }

  /**
   * Get the currently authenticated user's profile.
   */
  async me(): Promise<MeResponse> {
    try {
      const apiKey = this.client.getApiKey();
      const token = (this.client as any).getToken();

      let response: any;

      if (apiKey && token) {
        response = await (this.client as any).post(this.resolveBotPath('/0/0/0/0/0/'), {
          token: token
        });
      } else {
        response = await this.client.get<any>('/auth/me');
      }

      this.currentUser = this.handle<any>(response);
      return this.createSuccess(this.currentUser) as any;
    } catch (error: any) {
      this.currentUser = null;
      return this.createError(error.message) as any;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!(this.client as any).getToken();
  }
}



