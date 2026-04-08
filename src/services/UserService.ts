import { User } from '../models/auth/User';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
  constructor(client: any) {
    super(client);
    console.log('[UserService] Initialized with methods:', Object.getOwnPropertyNames(UserService.prototype));
  }

  /**
   * Search for users based on a query string.
   */
  async search(query: string): Promise<User[]> {
    try {
      const response = await this.client.get<any>(`/users/search`, {
        params: { q: query }
      });
      const icerik = this.handleResponse<any[]>(response);
      return Array.isArray(icerik) ? icerik.map((u: any) => User.fromJSON(u)) : [];
    } catch (error) {
      console.error('[UserService] User search failed:', error);
      return [];
    }
  }

  /**
   * Get a specific user's public profile using the bot API.
   */
  async getUserByUsername(username: string): Promise<User | null> {
    console.log('[UserService] Getting profile for:', username);
    try {
      const formData = new FormData();
      formData.append('oyuncubakusername', username);

      const response = await this.client.post<any>('/0/0/0/', formData);
      const icerik = this.handleResponse<any>(response);
      return icerik ? User.fromJSON(icerik) : null;
    } catch (error) {
      console.error(`[UserService] Fetching profile for ${username} failed:`, error);
      return null;
    }
  }

  /**
   * Get a specific user's public profile (Legacy API).
   */

  /**
   * Follow or unfollow a user.
   */
  async toggleFollow(userId: string): Promise<boolean> {
    try {
      const response = await this.client.post<any>(`/users/${userId}/follow`, {});
      const icerik = this.handleResponse<{ following: boolean }>(response);
      return icerik.following;
    } catch (error) {
      console.error('[UserService] Toggle follow failed:', error);
      return false;
    }
  }

  /**
   * Get a user's friends list.
   */
  async getFriends(userId: string): Promise<User[]> {
    try {
      const response = await this.client.get<any>(`/users/${userId}/friends`);
      const icerik = this.handleResponse<any[]>(response);
      return Array.isArray(icerik) ? icerik.map((u: any) => User.fromJSON(u)) : [];
    } catch (error) {
      console.error('[UserService] Get friends failed:', error);
      return [];
    }
  }

  /**
   * Update the current user's profile information.
   */
  async updateProfile(data: Partial<User>): Promise<User | null> {
    try {
      const response = await this.client.post<any>('/users/me/update', data);
      const icerik = this.handleResponse<any>(response);
      return icerik ? User.fromJSON(icerik) : null;
    } catch (error) {
      console.error('[UserService] Update profile failed:', error);
      return null;
    }
  }
}

