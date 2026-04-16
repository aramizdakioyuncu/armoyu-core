import { User } from '../models/auth/User';
import { RankedUser } from '../models/auth/RankedUser';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { NotificationCategory, NotificationSubCategory } from '../models/social/notification/NotificationEnums';
import { MediaCategory } from '../models/social/meta/MediaEnums';
import { ServiceResponse } from '../api/ServiceResponse';

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
  async search(query: string): Promise<ServiceResponse<User[]>> {
    try {
      const response = await this.client.get<any>(`/users/search`, {
        params: { q: query }
      });
      const icerik = this.handleResponse<any[]>(response);
      const users = Array.isArray(icerik) ? icerik.map((u: any) => User.fromJSON(u)) : [];
      return this.createSuccess(users);
    } catch (error: any) {
      this.logger.error('[UserService] User search failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a specific user's public profile using the bot API.
   */
  async getUserByUsername(username: string): Promise<ServiceResponse<User | null>> {
    this.logger.info('[UserService] Getting profile for:', username);
    try {
      const formData = new FormData();
      formData.append('oyuncubakusername', username);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      const user = icerik ? User.fromJSON(icerik) : null;
      return this.createSuccess(user, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching profile for ${username} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Follow or unfollow a user.
   */
  async toggleFollow(userId: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/users/${userId}/follow`, {});
      const icerik = this.handleResponse<{ following: boolean }>(response);
      return this.createSuccess(icerik.following, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Toggle follow failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Sends a friend request or adds a friend (Legacy).
   * 
   * @param userId The ID of the player to add (oyuncubakid)
   */
  async addFriend(userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-ol/0/0/'), formData);
      const data = this.handleResponse<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Adding friend ${userId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Removes a friend connection (Legacy).
   * 
   * @param userId The ID of the player to remove (oyuncubakid)
   */
  async removeFriend(userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-cikar/0/0/'), formData);
      const data = this.handleResponse<any>(response);
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Removing friend ${userId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Responds to a friend request (Legacy).
   * 
   * @param userId The ID of the requester (oyuncubakid)
   * @param response The response (1 for accept, 0 for decline)
   */
  async respondToFriendRequest(userId: number, response: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('cevap', response.toString());

      const responseApi = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-cevap/0/0/'), formData);
      const icerik = this.handleResponse<any>(responseApi);
      return this.createSuccess(icerik, responseApi?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Responding to friend ${userId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get a user's friends list.
   */
  async getFriends(userId: string): Promise<ServiceResponse<User[]>> {
    try {
      const response = await this.client.get<any>(`/users/${userId}/friends`);
      const icerik = this.handleResponse<any[]>(response);
      const users = Array.isArray(icerik) ? icerik.map((u: any) => User.fromJSON(u)) : [];
      return this.createSuccess(users, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Get friends failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Update the current user's profile information.
   */
  async updateProfile(data: Partial<User>): Promise<ServiceResponse<User | null>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/users/me/update', data);
      const icerik = this.handleResponse<any>(response);
      const user = icerik ? User.fromJSON(icerik) : null;
      return this.createSuccess(user, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Update profile failed:', error);
      return this.createError(error.message);
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
  }): Promise<ServiceResponse<any>> {
    this.requireAuth();
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
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Update private personal info failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the educational history (schools) for a specific player (Legacy).
   * 
   * @param userId Optional ID of the player (oyuncubakid)
   */
  async getUserSchools(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullarim/0/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching schools failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches detailed information about a specific school (Legacy).
   * 
   * @param schoolId The ID of the school (okulID)
   */
  async getSchoolDetail(schoolId: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('okulID', schoolId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullar/detay/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching school detail for ${schoolId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the friends list for a specific player.
   * 
   * @param page Requested page number - MANDATORY
   * @param params Filtering and specific player ID
   */
  async getFriendsList(page: number, params: { userId?: number, limit?: number } = {}): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 100).toString());
      
      if (params.userId !== undefined) {
        formData.append('oyuncubakid', params.userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/arkadaslarim/${page}/0/`), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching friends list failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the invitations list for the current player (Legacy).
   * 
   * @param page The page number (sayfa)
   */
  async getInvitationsList(page: number = 1): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/davetliste/${page}/0/`), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching invitations list failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Refreshes the user's invitation code (Legacy).
   */
  async refreshInviteCode(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/davetkodyenile/0/'), {});
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Refreshing invite code failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Requests an email verification URL for the user (Legacy).
   * 
   * @param userId Optional ID of the player (userID)
   */
  async requestEmailVerificationUrl(userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('userID', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/maildogrulamaURL/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Requesting email verification URL failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Pokes a friend (Legacy).
   * 
   * @param userId The ID of the friend to poke (oyuncubakid)
   */
  async pokeFriend(userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-durt/0/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Poking friend ${userId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Sets the user's favorite team (Legacy).
   * 
   * @param teamId The ID of the team (favoritakimID)
   */
  async setFavoriteTeam(teamId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('favoritakimID', teamId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/favoritakimsec/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Setting favorite team ${teamId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the media (photos/videos) for a specific player.
   * 
   * @param page Requested page number - MANDATORY
   * @param params Filtering options
   */
  async getUserMedia(page: number, params: { 
    userId?: number, 
    limit?: number, 
    category?: MediaCategory | string 
  } = {}): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (params.userId !== undefined) {
        formData.append('oyuncubakid', params.userId.toString());
      }
      formData.append('limit', (params.limit || 50).toString());
      formData.append('sayfa', page.toString());
      formData.append('kategori', params.category || 'all');

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/medya/${page}/0/`), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching media failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the social profile details for a specific player (Legacy).
   * 
   * @param userId Optional ID of the player (oyuncubakid)
   */
  async getSocialProfile(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId !== undefined) {
        formData.append('oyuncubakid', userId.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/profil/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching social profile failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the notifications for the current user (Legacy).
   */
  async getNotifications(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirim/0/0/'), {});
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching notifications failed:`, error);
      return this.createError(error.message);
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
  async getNotificationsHistory(
    page: number = 1, 
    limit: number = 20, 
    category?: NotificationCategory | string, 
    subCategory?: NotificationSubCategory | string
  ): Promise<ServiceResponse<any>> {
    this.requireAuth();
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

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/bildirimler/${page}/0/`), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching notifications history failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Updates the user's avatar (Legacy).
   * 
   * @param image The image file to upload (File, Blob, or File[])
   */
  async updateAvatar(image: File | Blob | File[]): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const file = Array.isArray(image) ? image[0] : image;
      if (!file) return this.createError('Dosya seçilmedi.');

      const formData = new FormData();
      formData.append('resim', file);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/avatar-guncelle/0/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Updating avatar failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Resets the user's avatar to default (Legacy).
   */
  async resetAvatar(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/avatar-varsayilan/0/0/'), {});
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Resetting avatar failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Resets the user's profile banner to default (Legacy).
   */
  async resetBanner(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/banner-varsayilan/0/0/'), {});
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Resetting banner failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Updates the user's profile background (Legacy).
   * 
   * @param image The image file to upload (File, Blob, or File[])
   */
  async updateBackground(image: File | Blob | File[]): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const file = Array.isArray(image) ? image[0] : image;
      if (!file) return this.createError('Dosya seçilmedi.');

      const formData = new FormData();
      formData.append('resim', file);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkaplan-guncelle/0/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Updating background failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Rotates a photo by a specified degree (Legacy).
   * 
   * @param photoId The ID of the photo to rotate
   * @param degree The rotation degree (e.g. -1 for clockwise, 90, 180, etc.)
   */
  async rotateMedia(photoId: number, degree: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('fotografID', photoId.toString());
      formData.append('derece', degree.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/donder/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Rotating media ${photoId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Deletes a specific media item (Legacy).
   * 
   * @param mediaId The ID of the media to delete
   */
  async deleteMedia(mediaId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('medyaID', mediaId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/sil/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Deleting media ${mediaId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Uploads one or more media files (Legacy).
   * 
   * @param files Array of File or Blob objects
   * @param category Optional category for the upload
   */
  async uploadMedia(files: (File | Blob)[], category: MediaCategory | string = MediaCategory.ALL): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media[]', file);
      });
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/yukle/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Uploading media failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the user's notification settings (Legacy).
   */
  async getNotificationSettings(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirimler/ayarlar/liste/'), {});
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Fetching notification settings failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Updates notification settings (Legacy).
   * 
   * @param settings Record of settings (e.g. { paylasimbegeni: true })
   */
  async updateNotificationSettings(settings: Record<string, boolean | number>): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        const val = typeof value === 'boolean' ? (value ? 1 : 0) : value;
        formData.append('notification[]', `${key}=${val}`);
      });

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/bildirimler/ayarlar/0/'), formData);
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Updating notification settings failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the permissions/authorizations for the current user (Legacy).
   */
  async getPermissions(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yetkiler/0/0/'), {});
      const icerik = this.handleResponse<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Fetching permissions failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the XP rankings (leaderboard) (Legacy).
   * 
   * @param page Ranking page number
   */
  async getXpRankings(page: number = 1): Promise<ServiceResponse<RankedUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const url = this.resolveBotPath(`/0/0/xpsiralama/${page}/0/`);
      const apiResponse = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(apiResponse);
      const users = Array.isArray(data) ? data.map((u: any) => RankedUser.fromJSON(u)) : [];
      
      return this.createSuccess(users, apiResponse?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Fetching XP rankings failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the popularity rankings (Legacy).
   * 
   * @param page Ranking page number
   */
  async getPopRankings(page: number = 1): Promise<ServiceResponse<RankedUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());

      const url = this.resolveBotPath(`/0/0/popsiralama/${page}/0/`);
      const apiResponse = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(apiResponse);
      const users = Array.isArray(data) ? data.map((u: any) => RankedUser.fromJSON(u)) : [];
      
      return this.createSuccess(users, apiResponse?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Fetching popularity rankings failed:', error);
      return this.createError(error.message);
    }
  }
}
