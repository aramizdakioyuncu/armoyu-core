import { ApiClient } from '../api/ApiClient';
import { User } from '../models/auth/User';
import { Session } from '../models/auth/Session';


export class AuthService {
  private static currentUser: User | null = null;
  private static session: Session | null = null;

  /**
   * Authenticate a user with username and password.
   */
  static async login(username: string, password: string): Promise<{ user: User; session: Session }> {
    try {
      const response = await ApiClient.post<{ user: any; session: any }>('/auth/login', {
        username,
        password
      });

      this.currentUser = User.fromJSON(response.user);
      this.session = Session.fromJSON(response.session);
      
      // Store token in localStorage if available
      if (typeof window !== 'undefined' && this.session.token) {
        localStorage.setItem('armoyu_token', this.session.token);
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
  static async register(data: any): Promise<{ user: User }> {
    try {
      const response = await ApiClient.post<{ user: any }>('/auth/register', data);
      return { user: User.fromJSON(response.user) };
    } catch (error) {
      console.error('[AuthService] Registration failed:', error);
      throw error;
    }
  }

  /**
   * Logout the current user.
   */
  static async logout(): Promise<void> {
    try {
      await ApiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('[AuthService] Logout API call failed:', error);
    } finally {
      this.currentUser = null;
      this.session = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('armoyu_token');
      }
    }
  }

  /**
   * Get the currently authenticated user's profile.
   */
  static async me(): Promise<User | null> {
    try {
      if (this.currentUser) return this.currentUser;

      const response = await ApiClient.get<{ user: any }>('/auth/me');
      this.currentUser = User.fromJSON(response.user);
      return this.currentUser;
    } catch (error) {
      return null;
    }
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static getSession(): Session | null {
    return this.session;
  }

  static isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}
