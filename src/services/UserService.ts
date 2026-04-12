import { User } from '../models/auth/User';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { NotificationCategory, NotificationSubCategory } from '../models/social/NotificationEnums';
import { MediaCategory } from '../models/social/MediaEnums';

/**
 * Service for managing user profiles, relationships, media, and social rankings.
 * @checked 2026-04-12
 */
export class UserService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.logger.debug?.('[UserService] Initialized');
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
      this.logger.error('[UserService] User search failed:', error);
      return [];
    }
  }

  /**
   * Get a specific user's public profile using the bot API.
   */
  async getUserByUsername(username: string): Promise<User | null> {
    this.logger.info('[UserService] Getting profile for:', username);
    try {
      const formData = new FormData();
      formData.append('oyuncubakusername', username);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return icerik ? User.fromJSON(icerik) : null;
    } catch (error) {
      this.logger.error(`[UserService] Fetching profile for ${username} failed:`, error);
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
      this.logger.error('[UserService] Toggle follow failed:', error);
      return false;
    }
  }

  /**
   * Sends a friend request or adds a friend (Legacy).
   * 
   * @param userId The ID of the player to add (oyuncubakid)
   */
  async addFriend(userId: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-ol/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Adding friend ${userId} failed:`, error);
      return null;
    }
  }

  /**
   * Removes a friend connection (Legacy).
   * 
   * @param userId The ID of the player to remove (oyuncubakid)
   */
  async removeFriend(userId: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-cikar/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Removing friend ${userId} failed:`, error);
      return null;
    }
  }

  /**
   * Responds to a friend request (Legacy).
   * 
   * @param userId The ID of the requester (oyuncubakid)
   * @param response The response (1 for accept, 0 for decline)
   */
  async respondToFriendRequest(userId: number, response: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('cevap', response.toString());

      const responseApi = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-cevap/0/0/'), formData);
      return this.handleResponse<any>(responseApi);
    } catch (error) {
      this.logger.error(`[UserService] Responding to friend ${userId} failed:`, error);
      return null;
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
      this.logger.error('[UserService] Get friends failed:', error);
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
      this.logger.error('[UserService] Update profile failed:', error);
      return null;
    }
  }

  /**
   * Updates the current user's private personal information (Legacy).
   * 
   * @param data The private information data including password verification
   */
  async updatePrivatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    birthday?: string;
    phoneNumber?: string;
    countryID?: number;
    provinceID?: number;
    passwordControl: string;
  }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('v1', '1');
      formData.append('ad', data.firstName || '');
      formData.append('soyad', data.lastName || '');
      formData.append('email', data.email || '');
      formData.append('birthday', data.birthday || '');
      formData.append('phoneNumber', data.phoneNumber || '');
      formData.append('countryID', data.countryID?.toString() || '');
      formData.append('provinceID', data.provinceID?.toString() || '');
      formData.append('passwordControl', data.passwordControl);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/ozelbilgiler/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[UserService] Update private personal info failed:', error);
      return null;
    }
  }

  /**
   * Fetches the educational history (schools) for a specific player (Legacy).
   * 
   * @param userId Optional ID of the player (oyuncubakid)
   */
  async getUserSchools(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullarim/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching schools failed:`, error);
      return null;
    }
  }

  /**
   * Fetches detailed information about a specific school (Legacy).
   * 
   * @param schoolId The ID of the school (okulID)
   */
  async getSchoolDetail(schoolId: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('okulID', schoolId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullar/detay/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching school detail for ${schoolId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the friends list for a specific player (Legacy).
   * 
   * @param params Pagination and specific player ID
   */
  async getFriendsList(params: { userId?: number, page?: number, limit?: number } = {}): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', (params.page || 1).toString());
      formData.append('limit', (params.limit || 100).toString());
      
      if (params.userId !== undefined) {
        formData.append('oyuncubakid', params.userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadaslarim/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching friends list failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the invitations list for the current player (Legacy).
   * 
   * @param page The page number (sayfa)
   */
  async getInvitationsList(page: number = 1): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/davetliste/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching invitations list failed:`, error);
      return null;
    }
  }

  /**
   * Refreshes the user's invitation code (Legacy).
   */
  async refreshInviteCode(): Promise<any> {
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/davetkodyenile/0/'), {});
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Refreshing invite code failed:`, error);
      return null;
    }
  }

  /**
   * Requests an email verification URL for the user (Legacy).
   * 
   * @param userId Optional ID of the player (userID)
   */
  async requestEmailVerificationUrl(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('userID', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/maildogrulamaURL/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Requesting email verification URL failed:`, error);
      return null;
    }
  }

  /**
   * Pokes a friend (Legacy).
   * 
   * @param userId The ID of the friend to poke (oyuncubakid)
   */
  async pokeFriend(userId: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-durt/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Poking friend ${userId} failed:`, error);
      return null;
    }
  }

  /**
   * Sets the user's favorite team (Legacy).
   * 
   * @param teamId The ID of the team (favoritakimID)
   */
  async setFavoriteTeam(teamId: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('favoritakimID', teamId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/favoritakimsec/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Setting favorite team ${teamId} failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the media (photos/videos) for a specific player (Legacy).
   * 
   * @param params Filtering and pagination options
   */
  async getUserMedia(params: { 
    userId?: number, 
    limit?: number, 
    page?: number, 
    category?: MediaCategory | string 
  }): Promise<any> {
    try {
      const formData = new FormData();
      if (params.userId !== undefined) {
        formData.append('oyuncubakid', params.userId.toString());
      }
      formData.append('limit', (params.limit || 50).toString());
      formData.append('sayfa', (params.page || 1).toString());
      formData.append('kategori', params.category || 'all');

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching media failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the social profile details for a specific player (Legacy).
   * 
   * @param userId Optional ID of the player (oyuncubakid)
   */
  async getSocialProfile(userId?: number): Promise<any> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/profil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching social profile failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the notifications for the current user (Legacy).
   */
  async getNotifications(): Promise<any> {
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirim/0/0/'), {});
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching notifications failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the paginated notifications history for the current user (Legacy).
   * 
   * @param page The page number (sayfa)
   * @param limit The number of items per page
   * @param category Optional category filter (kategori)
   * @param subCategory Optional sub-category filter (kategoridetay)
   */
  /**
   * Fetches the paginated notifications history for the current user (Legacy).
   * 
   * @param page The page number (sayfa)
   * @param limit The number of items per page
   * @param category Optional category filter (kategori)
   * @param subCategory Optional sub-category filter (kategoridetay)
   */
  async getNotificationsHistory(
    page: number = 1, 
    limit: number = 20, 
    category?: NotificationCategory | string, 
    subCategory?: NotificationSubCategory | string
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      
      if (category) {
        formData.append('kategori', category);
      }
      if (subCategory) {
        formData.append('kategoridetay', subCategory);
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirimler/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching notifications history failed:`, error);
      return null;
    }
  }

  /**
   * Updates the user's avatar (Legacy).
   * 
   * @param image The image file to upload (File, Blob, or File[])
   */
  async updateAvatar(image: File | Blob | File[]): Promise<any> {
    try {
      const file = Array.isArray(image) ? image[0] : image;
      if (!file) return null;

      const formData = new FormData();
      formData.append('resim', file);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/avatar-guncelle/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Updating avatar failed:`, error);
      return null;
    }
  }

  /**
   * Resets the user's avatar to default (Legacy).
   */
  async resetAvatar(): Promise<any> {
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/avatar-varsayilan/0/0/'), {});
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Resetting avatar failed:`, error);
      return null;
    }
  }

  /**
   * Resets the user's profile banner to default (Legacy).
   */
  async resetBanner(): Promise<any> {
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/banner-varsayilan/0/0/'), {});
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Resetting banner failed:`, error);
      return null;
    }
  }

  /**
   * Updates the user's profile background (Legacy).
   * 
   * @param image The image file to upload (File or Blob)
   */
  /**
   * Updates the user's profile background (Legacy).
   * 
   * @param image The image file to upload (File, Blob, or File[])
   */
  async updateBackground(image: File | Blob | File[]): Promise<any> {
    try {
      const file = Array.isArray(image) ? image[0] : image;
      if (!file) return null;

      const formData = new FormData();
      formData.append('resim', file);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkaplan-guncelle/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Updating background failed:`, error);
      return null;
    }
  }

  /**
   * Rotates a photo by a specified degree (Legacy).
   * 
   * @param photoId The ID of the photo to rotate
   * @param degree The rotation degree (e.g. -1 for clockwise, 90, 180, etc.)
   */
  /**
   * Rotates a photo by a specified degree (Legacy).
   * 
   * @param photoId The ID of the photo to rotate
   * @param degree The rotation degree (e.g. -1 for clockwise, 90, 180, etc.)
   */
  async rotateMedia(photoId: number, degree: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('fotografID', photoId.toString());
      formData.append('derece', degree.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/donder/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Rotating media ${photoId} failed:`, error);
      return null;
    }
  }

  /**
   * Deletes a specific media item (Legacy).
   * 
   * @param mediaId The ID of the media to delete
   */
  async deleteMedia(mediaId: number): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('medyaID', mediaId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/sil/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Deleting media ${mediaId} failed:`, error);
      return null;
    }
  }

  /**
   * Uploads one or more media files (Legacy).
   * 
   * @param files Array of File or Blob objects
   * @param category Optional category for the upload
   */
  /**
   * Uploads one or more media files (Legacy).
   * 
   * @param files Array of File or Blob objects
   * @param category Optional category for the upload
   */
  async uploadMedia(files: (File | Blob)[], category: MediaCategory | string = MediaCategory.ALL): Promise<any> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media[]', file);
      });
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/yukle/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Uploading media failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the user's notification settings (Legacy).
   */
  async getNotificationSettings(): Promise<any> {
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirimler/ayarlar/liste/'), {});
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching notification settings failed:`, error);
      return null;
    }
  }

  /**
   * Updates notification settings (Legacy).
   * 
   * @param settings Record of settings (e.g. { paylasimbegeni: true })
   */
  async updateNotificationSettings(settings: Record<string, boolean | number>): Promise<any> {
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
        formData.append('notification[]', `${key}=${val}`);
      });

      const response = await this.client.post<any>(this.resolveBotPath('/deneme/deneme/bildirimler/ayarlar/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Updating notification settings failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the platform-wide XP rankings (Legacy).
   * 
   * @param page The page number (sayfa)
   */
  async getXpRankings(page: number = 1): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/xpsiralama/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching XP rankings failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the platform-wide Popularity rankings (Legacy).
   * 
   * @param page The page number (sayfa)
   */
  async getPopRankings(page: number = 1): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/popsiralama/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[UserService] Fetching POP rankings failed:`, error);
      return null;
    }
  }
}

