import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';
import { BaseService } from './BaseService';

export class AuthService extends BaseService {
  private currentUser: User | null = null;
  private session: Session | null = null;

  /**
   * Authenticate a user with username and password.
   */
  async login(username: string, password: string): Promise<{ user: User; session: Session }> {
    try {
      const response = await this.client.post<{ user: any; session: any }>('/auth/login', {
        username,
        password
      });

      this.currentUser = User.fromJSON(response.user);
      this.session = Session.fromJSON(response.session);
      
      // Update client token if session exists
      if (this.session.token) {
        this.client.setToken(this.session.token);
        
        // Store token in localStorage if available (standard browser behavior)
        if (typeof window !== 'undefined') {
          localStorage.setItem('armoyu_token', this.session.token);
        }
      }

      return { user: this.currentUser, session: this.session };
    } catch (error) {
      console.error('[AuthService] Login failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user.
   */
  async register(data: any): Promise<{ user: User }> {
    try {
      const response = await this.client.post<{ user: any }>('/auth/register', data);
      return { user: User.fromJSON(response.user) };
    } catch (error) {
      console.error('[AuthService] Registration failed:', error);
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
      console.error('[AuthService] Logout API call failed:', error);
    } finally {
      this.currentUser = null;
      this.session = null;
      this.client.setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('armoyu_token');
      }
    }
  }

  /**
   * Get the currently authenticated user's profile.
   */
  async me(): Promise<User | null> {
    try {
      const response = await this.client.get<{ user: any }>('/auth/me');
      this.currentUser = User.fromJSON(response.user);
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

