import { ApiClient } from '../api/ApiClient';
import { User } from '../models/auth/User';

export class UserService {
  /**
   * Search for users based on a query string.
   */
  static async search(query: string): Promise<User[]> {
    try {
      const response = await ApiClient.get<any[]>(`/users/search?q=${encodeURIComponent(query)}`);
      return Array.isArray(response) ? response.map((u: any) => User.fromJSON(u)) : [];
    } catch (error) {
      console.error('[UserService] User search failed:', error);
      return [];
    }
  }

  /**
   * Get a specific user's public profile.
   */
  static async getProfile(username: string): Promise<User | null> {
    try {
      const response = await ApiClient.get<any>(`/users/${username}`);
      return response ? User.fromJSON(response) : null;
    } catch (error) {
      console.error(`[UserService] Fetching profile for ${username} failed:`, error);
      return null;
    }
  }

  /**
   * Follow or unfollow a user.
   */
  static async toggleFollow(userId: string): Promise<boolean> {
    try {
      const response = await ApiClient.post<{ following: boolean }>(`/users/${userId}/follow`, {});
      return response.following;
    } catch (error) {
      console.error('[UserService] Toggle follow failed:', error);
      return false;
    }
  }

  /**
   * Get a user's friends list.
   */
  static async getFriends(userId: string): Promise<User[]> {
    try {
      const response = await ApiClient.get<any[]>(`/users/${userId}/friends`);
      return Array.isArray(response) ? response.map((u: any) => User.fromJSON(u)) : [];
    } catch (error) {
      console.error('[UserService] Get friends failed:', error);
      return [];
    }
  }

  /**
   * Update the current user's profile information.
   */
  static async updateProfile(data: Partial<User>): Promise<User | null> {
    try {
      const response = await ApiClient.post<any>('/users/me/update', data);
      return response ? User.fromJSON(response) : null;
    } catch (error) {
      console.error('[UserService] Update profile failed:', error);
      return null;
    }
  }
}
