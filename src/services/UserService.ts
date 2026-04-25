import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { RankingUserResponse, UserProfileResponse, UserResponse, InviteCodeCheckResponse, SearchUserResponse, MediaResponse } from '../models';
import { UserMapper, MediaMapper } from '../utils/mappers';

/**
 * Service for user management, profiles, and rankings.
 * Uses specialized mappers for each unique page/endpoint.
 */
export class UserService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get user profile by username.
   */
  async getUserByUsername(username: string): Promise<ServiceResponse<UserProfileResponse>> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', '0');
      formData.append('oyuncubakusername', username);

      const response = await this.client.post<any>('/0/0/0/0/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = UserMapper.mapProfile(icerik);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to fetch profile for ${username}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Update private personal information.
   */
  async updatePrivatePersonalInfo(data: any): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('ad', data.firstName || '');
      formData.append('soyad', data.lastName || '');
      formData.append('eposta', data.email || '');
      formData.append('dogumtarihi', data.birthday || '');
      formData.append('tel', data.phoneNumber || '');
      formData.append('ulke', (data.countryID || 0).toString());
      formData.append('sehir', (data.provinceID || 0).toString());
      formData.append('tc', data.idNumber || '');
      formData.append('sifrekontrol', data.passwordControl || '');

      const response = await this.client.post<any>('/0/0/ayarlar/ozelbilgi-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Update personal info failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Update special personal information (Modern Profile Edit).
   */
  async updateSpecialPersonalInfo(data: {
    ad?: string;
    soyad?: string;
    email?: string;
    birthday?: string;
    phoneNumber?: string;
    countryID?: string | number;
    provinceID?: string | number;
    passwordControl: string;
    v1?: string;
  }): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('v1', data.v1 || '1');
      formData.append('ad', data.ad || '');
      formData.append('soyad', data.soyad || '');
      formData.append('email', data.email || '');
      formData.append('birthday', data.birthday || '');
      formData.append('phoneNumber', data.phoneNumber || '');
      formData.append('countryID', (data.countryID || '').toString());
      formData.append('provinceID', (data.provinceID || '').toString());
      formData.append('passwordControl', data.passwordControl);

      const response = await this.client.post<any>('/0/0/profil/ozelbilgiler/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Update special personal info failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetch friends list with pagination.
   */
  async getFriendsList(page: number, options?: { userId?: number, limit?: number }): Promise<ServiceResponse<RankingUserResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());

      const response = await this.client.post<any>('/0/0/arkadaslarim/0/0/', formData);
      const icerik = this.handle<any>(response);

      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.oyuncular || []);
      const mapped = UserMapper.mapXpRankingList(rawList);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch friends list:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Add a user to friends.
   */
  async addFriend(userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/arkadaslik/ekle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to add friend ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Remove a user from friends.
   */
  async removeFriend(userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/arkadaslik/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to remove friend ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Respond to a friend request.
   */
  async respondToFriendRequest(userId: number, response: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('cevap', response.toString());
      const apiResponse = await this.client.post<any>('/0/0/arkadaslik/cevap/0/', formData);
      this.handle(apiResponse);
      return this.createSuccess(true, apiResponse?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to respond to friend request from ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetch school information for a user.
   */
  async getUserSchools(userId?: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/okullarim/0/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(Array.isArray(icerik) ? icerik : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch schools:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get details for a specific school.
   */
  async getSchoolDetail(schoolId: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('okulID', schoolId.toString());
      const response = await this.client.post<any>('/0/0/okulbak/0/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to fetch school details for ${schoolId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetch pending invitations.
   */
  async getInvitationsList(page: number): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>('/0/0/davetliste/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = UserMapper.mapInvitationList(Array.isArray(icerik) ? icerik : (icerik?.liste || []));
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch invitations:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Refresh invite code.
   */
  async refreshInviteCode(): Promise<ServiceResponse<string>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/davetkodyenile/0/', new FormData());
      const code = response?.aciklamadetay || '';
      return this.createSuccess(code, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to refresh invite code:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Send verification email to a user (invited or self).
   */
  async sendVerificationEmail(userId: string | number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('userID', userId.toString());
      const response = await this.client.post<any>('/0/0/profil/maildogrulamaURL/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to send verification email to ${userId}:`, error);
      return this.createError(error.message);
    }
  }


  /**
   * Check an invite code to see who it belongs to.
   */
  async checkInviteCode(code: string): Promise<ServiceResponse<InviteCodeCheckResponse>> {
    try {
      const formData = new FormData();
      formData.append('davetkodu', code);
      const response = await this.client.post<any>('/0/0/davetkodsorgula/0/', formData);
      const detail = response?.aciklamadetay;
      const mapped = UserMapper.mapInviteCodeCheck(detail);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Invite code check failed for ${code}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Request email verification URL.
   */
  async requestEmailVerificationUrl(userId?: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/ayarlar/eposta-onay-istegi/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Email verification request failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Poke a friend.
   */
  async pokeFriend(userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/arkadaslik/dort/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserService] Failed to poke friend ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Set favorite team.
   */
  async setFavoriteTeam(teamId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('takimID', teamId.toString());
      const response = await this.client.post<any>('/0/0/ayarlar/takim-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to set favorite team:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get social profile summary.
   */
  async getSocialProfile(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/sosyal/profil/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch social profile:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get user media (photos/videos).
   */
  async getUserMedia(page: number, options?: { userId?: number, limit?: number, category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());
      if (options?.category) formData.append('kategori', options.category);

      const response = await this.client.post<any>('/0/0/medya/0/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.medyalar || []);
      const mapped = MediaMapper.mapGalleryList(rawList);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch media:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get notification history.
   */
  async getNotificationsHistory(page: number, limit: number = 20, category?: string, detail?: string): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      if (category) formData.append('kategori', category);
      if (detail) formData.append('kategoridetay', detail);

      const response = await this.client.post<any>('/0/0/bildirimler/gecmis/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(Array.isArray(icerik) ? icerik : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch notification history:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get current notifications.
   */
  async getNotifications(): Promise<ServiceResponse<any[]>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/bildirimler/0/0/', new FormData());
      const icerik = this.handle<any[]>(response);
      return this.createSuccess(Array.isArray(icerik) ? icerik : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch notifications:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Update user avatar.
   */
  async updateAvatar(file: File | File[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('resim', Array.isArray(file) ? file[0] : file);
      const response = await this.client.post<any>('/0/0/ayarlar/profil-resmi-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Avatar update failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Reset user avatar to default.
   */
  async resetAvatar(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/profil-resmi-sil/0/', new FormData());
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Avatar reset failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Reset user banner to default.
   */
  async resetBanner(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/profil-arkaplan-sil/0/', new FormData());
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Banner reset failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Update user background banner.
   */
  async updateBackground(file: File | File[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('resim', Array.isArray(file) ? file[0] : file);
      const response = await this.client.post<any>('/0/0/ayarlar/profil-arkaplan-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Background update failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Rotate a media item.
   */
  async rotateMedia(mediaId: number, degree: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('fotografID', mediaId.toString());
      formData.append('derece', degree.toString());
      const response = await this.client.post<any>('/0/0/medya/dondur/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Media rotation failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a media item.
   */
  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('medyaID', mediaId.toString());
      const response = await this.client.post<any>('/0/0/medya/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Media deletion failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Upload media items.
   */
  async uploadMedia(files: File[], category?: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('media[]', f));
      if (category) formData.append('category', category);

      const response = await this.client.post<any>('/0/0/medya/yukle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Media upload failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get user notification settings.
   */
  async getNotificationSettings(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/bildirim/0/', new FormData());
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch notification settings:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Update notification settings.
   */
  async updateNotificationSettings(settings: Record<string, number>): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([k, v]) => formData.append(k, v.toString()));
      const response = await this.client.post<any>('/0/0/ayarlar/bildirim-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to update notification settings:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get user media list (photos/videos).
   */
  async getUserMediaLegacy(page: number, options?: { userId?: number, limit?: number, category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    return this.getUserMedia(page, options);
  }

  /**
   * Get overall XP rankings.
   */
  async getXpRankings(page: number, limit?: number): Promise<ServiceResponse<RankingUserResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(`/0/0/xpsiralama/0/0/`, formData);
      const icerik = this.handle<any>(response);

      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.oyuncular || []);
      const mapped = UserMapper.mapXpRankingList(rawList);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch XP rankings:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get overall Popularity rankings.
   */
  async getPopRankings(page: number, limit?: number): Promise<ServiceResponse<RankingUserResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const response = await this.client.post<any>(`/0/0/popsiralama/0/0/`, formData);
      const icerik = this.handle<any>(response);

      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.oyuncular || []);
      const mapped = UserMapper.mapPopRankingList(rawList);

      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserService] Failed to fetch POP rankings:', error);
      return this.createError(error.message);
    }
  }
}

