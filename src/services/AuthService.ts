import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { PasswordResetPreference } from '../models/social/AuthEnums';

/**
 * Service for managing user authentication, registration, and session lifecycle.
 * @checked 2026-04-12
 */
export class AuthService extends BaseService {
  private currentUser: User | null = null;
  private session: Session | null = null;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Authenticate a user with username and password.
   */
  async login(username: string, password: string): Promise<{ user: User; session: Session }> {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      // Compatibility with legacy ARMOYU v0
      formData.append('kullaniciadi', username);
      formData.append('parola', password);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/0'), formData);

      // Handle raw response if it's still a string (though ApiClient should have parsed it)
      const data = typeof response === 'string' ? JSON.parse(response) : response;

      const icerik = this.handleResponse<any>(data);

      if (!icerik) {
        throw new Error('API Hatası: Kullanıcı bilgileri alınamadı.');
      }

      // ARMOYU Login logic: Token is inside the 'aciklama' field (as a string or object)
      let token = '';
      if (typeof data.aciklama === 'string') {
        // Only treat as token if it doesn't contain spaces/special characters (not a sentence like "Giriş Başarılı")
        const isStrictToken = /^[a-zA-Z0-9.\-_=]+$/.test(data.aciklama);
        if (isStrictToken) {
          token = data.aciklama;
        }
      } else if (data.aciklama && typeof data.aciklama === 'object') {
        token = data.aciklama.token || data.aciklama.session_token || '';
      }

      this.currentUser = User.fromJSON(icerik);
      
      // ARMOYU Login logic: Token can be in 'aciklama' OR inside 'icerik'
      const extractedToken = token || icerik?.token || icerik?.session_token || null;
      
      // EXTRA VALIDATION: Ensure we have a valid user ID and a token
      if (!this.currentUser.id) {
        this.logger.error('[AuthService] Login failed validation:', { 
          hasId: !!this.currentUser.id, 
          aciklama: data.aciklama,
          icerikItems: Object.keys(icerik || {})
        });
        throw new Error('Geçersiz kullanıcı bilgileri alınamadı.');
      }

      this.session = new Session({
        user: this.currentUser,
        token: extractedToken
      });

      // Update client token for all subsequent requests
      this.client.setToken(this.session.token);

      return { user: this.currentUser, session: this.session };
    } catch (error) {
      this.logger.error('[AuthService] Login failed:', error);
      throw error;
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
  }): Promise<boolean> {
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
      this.handleResponse<any>(data);

      return data && Number(data.durum) === 1;
    } catch (error) {
      this.logger.error('[AuthService] Registration failed:', error);
      return false;
    }
  }

  /**
   * Request a password reset (Legacy).
   */
  async forgotPassword(params: {
    username: string;
    email: string;
    birthday: string;
    preference: PasswordResetPreference | string;
  }): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('email', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('sifirlamatercihi', params.preference);

      const response = await this.client.post<any>(this.resolveBotPath('/sifremi-unuttum/0/0/0/0/'), formData);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      this.handleResponse<any>(data);

      return data && Number(data.durum) === 1;
    } catch (error) {
      this.logger.error('[AuthService] Forgot password request failed:', error);
      return false;
    }
  }

  /**
   * Verify and complete password reset (Legacy).
   */
  async verifyPasswordReset(params: {
    username: string;
    email: string;
    birthday: string;
    code: string;
    newPassword: string;
  }): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('kullaniciadi', params.username);
      formData.append('email', params.email);
      formData.append('dogumtarihi', params.birthday);
      formData.append('dogrulamakodu', params.code);
      formData.append('sifre', params.newPassword);
      formData.append('sifretekrar', params.newPassword);

      const response = await this.client.post<any>(this.resolveBotPath('/sifremi-unuttum-dogrula/0/0/0/0/'), formData);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      this.handleResponse<any>(data);

      return data && Number(data.durum) === 1;
    } catch (error) {
      this.logger.error('[AuthService] Verify password reset failed:', error);
      return false;
    }
  }

  /**
   * Logout the current user.
   */
  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout', {});
    } catch (error) {
      this.logger.error('[AuthService] Logout API call failed:', error);
    } finally {
      this.currentUser = null;
      this.session = null;
      this.client.setToken(null);
    }
  }

  /**
   * Get the currently authenticated user's profile.
   * Supports both modern (/auth/me) and legacy bot-based (/0/0/0) session recovery.
   */
  async me(): Promise<User | null> {
    try {
      const apiKey = this.client.getApiKey();
      const token = (this.client as any).getToken();

      let response: any;

      if (apiKey && token) {
        // Legacy bot-based session recovery
        const formData = new FormData();
        formData.append('token', token);
        formData.append('action', 'me');

        response = await (this.client as any).post(this.resolveBotPath('/0/0/0'), formData);
      } else {
        // Modern API session recovery
        response = await this.client.get<any>('/auth/me');
      }

      const icerik = this.handleResponse<any>(response);

      // Robust mapping: handle direct user object or nested { user: {...} }
      const userData = icerik && (icerik.user || icerik);
      this.currentUser = userData ? User.fromJSON(userData) : null;

      return this.currentUser;
    } catch (error) {
      this.currentUser = null;
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getSession(): Session | null {
    return this.session;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser || !!this.client;
  }
}

