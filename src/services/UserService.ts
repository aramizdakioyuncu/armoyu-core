import { User } from '../models/auth/User';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
  /**
   * Search for users based on a query string.
   */
  async search(query: string): Promise<User[]> {
    try {
      const response = await this.client.get<any[]>(`/users/search`, {
        params: { q: query }
      });
      return Array.isArray(response) ? response.map((u: any) => User.fromJSON(u)) : [];
    } catch (error) {
      console.error('[UserService] User search failed:', error);
      return [];
    }
  }

  /**
   * Get a specific user's public profile.
   */
  async getProfile(username: string): Promise<User | null> {
    try {
      const response = await this.client.get<any>(`/users/${username}`);
      return response ? User.fromJSON(response) : null;
    } catch (error) {
      console.error(`[UserService] Fetching profile for ${username} failed:`, error);
      return null;
    }
  }

  /**
   * Follow or unfollow a user.
   */
  async toggleFollow(userId: string): Promise<boolean> {
    try {
      const response = await this.client.post<{ following: boolean }>(`/users/${userId}/follow`, {});
      return response.following;
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
      const response = await this.client.get<any[]>(`/users/${userId}/friends`);
      return Array.isArray(response) ? response.map((u: any) => User.fromJSON(u)) : [];
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
      return response ? User.fromJSON(response) : null;
    } catch (error) {
      console.error('[UserService] Update profile failed:', error);
      return null;
    }
  }
}

