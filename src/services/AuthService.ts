import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

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

      const response = await this.client.post<any>('/0/0/0', formData);

      // Handle raw response if it's still a string (though ApiClient should have parsed it)
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      const icerik = this.handleResponse<any>(data);
      
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
      this.session = new Session({ 
        user: this.currentUser, 
        token: token || icerik?.token || icerik?.session_token || null 
      });
      
      // Update client token for all subsequent requests
      if (this.session.token) {
        this.client.setToken(this.session.token);
      }

      return { user: this.currentUser, session: this.session };
    } catch (error) {
      this.logger.error('[AuthService] Login failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user.
   */
  async register(data: any): Promise<{ user: User }> {
    try {
      const response = await this.client.post<any>('/auth/register', data);
      const icerik = this.handleResponse<{ user: any }>(response);
      return { user: User.fromJSON(icerik.user) };
    } catch (error) {
      this.logger.error('[AuthService] Registration failed:', error);
      throw error;
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
   */
  async me(): Promise<User | null> {
    try {
      const response = await this.client.get<any>('/auth/me');
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

