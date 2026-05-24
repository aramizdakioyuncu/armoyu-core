import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { User, RankingUser, MediaResponse, Notification, NotificationSettings, InviteCodeCheckResponse, School } from '../models';
import { UserMapper } from '../utils/mappers/user/UserMapper';
import { MediaMapper } from '../utils/mappers/content/MediaMapper';
import { NotificationMapper } from '../utils/mappers/social/NotificationMapper';
import { EducationMapper } from '../utils/mappers/education/EducationMapper';
import { NotificationSettingsMapper } from '../utils/mappers/user/NotificationSettingsMapper';

export interface UpdatePersonalInfoParams {
  ad?: string;
  soyad?: string;
  email?: string;
  birthday?: string;
  phoneNumber?: string;
  countryID?: string | number;
  provinceID?: string | number;
  passwordControl: string;
  v1?: string;
}

export class UserServiceV1 extends BaseService {
  async getOwnProfile(): Promise<ServiceResponse<User>> {
    return this.createError('getOwnProfile is not supported in V1');
  }

  async getUserByUsername(username: string): Promise<ServiceResponse<User>> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', '0');
      formData.append('oyuncubakusername', username);
      const response = await this.client.post<any>('/0/0/0/0/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(UserMapper.mapProfile(icerik), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to fetch profile for ${username}:`, error);
      return this.createError(error.message);
    }
  }

  async updateSpecialPersonalInfo(data: UpdatePersonalInfoParams): Promise<ServiceResponse<boolean>> {
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
      this.logger.error('[UserServiceV1] Update personal info failed:', error);
      return this.createError(error.message);
    }
  }

  async getFriendsList(page: number, options?: { userId?: number; limit?: number }): Promise<ServiceResponse<RankingUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());
      const response = await this.client.post<any>('/0/0/arkadaslarim/0/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.oyuncular || []);
      return this.createSuccess(UserMapper.mapXpRankingList(rawList), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch friends list:', error);
      return this.createError(error.message);
    }
  }

  async addFriend(userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/arkadas-ol/0/0/', formData);
      const isSuccess = response && (response.durum === 1 || response.aciklama === 'İstek gönderilmiş!' || response.aciklama?.includes('gönderildi'));
      if (isSuccess) return this.createSuccess(true, response?.aciklama);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to add friend ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  async removeFriend(userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/arkadas-cikar/0/0/', formData);
      const isSuccess = response && (response.durum === 1 || response.aciklama?.includes('çıkarıldı') || response.aciklama?.includes('silindi'));
      if (isSuccess) return this.createSuccess(true, response?.aciklama);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to remove friend ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  async respondToFriendRequest(userId: number, answer: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('cevap', answer.toString());
      const response = await this.client.post<any>('/0/0/arkadas-cevap/0/0/', formData);
      const isSuccess = response && (response.durum === 1 || response.aciklama?.includes('kabul') || response.aciklama?.includes('red') || response.aciklama?.includes('güncellendi'));
      if (isSuccess) return this.createSuccess(true, response?.aciklama);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to respond to friend request from ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  async getUserSchools(userId?: number): Promise<ServiceResponse<School[]>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/okullarim/0/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = (Array.isArray(icerik) ? icerik : []).map((i: any) => EducationMapper.mapSchool(i)).filter((s): s is School => s !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch schools:', error);
      return this.createError(error.message);
    }
  }

  async getSchoolDetail(schoolId: number): Promise<ServiceResponse<School | null>> {
    try {
      const formData = new FormData();
      formData.append('okulID', schoolId.toString());
      const response = await this.client.post<any>('/0/0/okulbak/0/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(EducationMapper.mapSchool(icerik), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to fetch school details for ${schoolId}:`, error);
      return this.createError(error.message);
    }
  }

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
      this.logger.error('[UserServiceV1] Failed to fetch invitations:', error);
      return this.createError(error.message);
    }
  }

  async refreshInviteCode(): Promise<ServiceResponse<string>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/davetkodyenile/0/', new FormData());
      const code = response?.aciklamadetay || '';
      return this.createSuccess(code, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to refresh invite code:', error);
      return this.createError(error.message);
    }
  }

  async sendVerificationEmail(userId: string | number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('userID', userId.toString());
      const response = await this.client.post<any>('/0/0/profil/maildogrulamaURL/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to send verification email to ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  async checkInviteCode(code: string): Promise<ServiceResponse<InviteCodeCheckResponse>> {
    try {
      const formData = new FormData();
      formData.append('davetkodu', code);
      const response = await this.client.post<any>('/0/0/davetkodsorgula/0/', formData);
      this.handle(response);
      const detail = response?.aciklamadetay;
      return this.createSuccess(UserMapper.mapInviteCodeCheck(detail), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Invite code check failed for ${code}:`, error);
      return this.createError(error.message);
    }
  }

  async requestEmailVerificationUrl(userId?: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/ayarlar/eposta-onay-istegi/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Email verification request failed:', error);
      return this.createError(error.message);
    }
  }

  async pokeFriend(userId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/arkadas-durt/0/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV1] Failed to poke friend ${userId}:`, error);
      return this.createError(error.message);
    }
  }

  async setFavoriteTeam(teamId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('takimID', teamId.toString());
      const response = await this.client.post<any>('/0/0/ayarlar/takim-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to set favorite team:', error);
      return this.createError(error.message);
    }
  }

  async getSocialProfile(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>('/0/0/sosyal/profil/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch social profile:', error);
      return this.createError(error.message);
    }
  }

  async getUserMedia(page: number, options?: { userId?: number; limit?: number; category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());
      if (options?.category) formData.append('kategori', options.category);
      const response = await this.client.post<any>('/0/0/medya/0/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.medyalar || []);
      return this.createSuccess(MediaMapper.mapGalleryList(rawList), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch media:', error);
      return this.createError(error.message);
    }
  }

  async getNotificationsHistory(page: number, limit: number = 20, category?: string, detail?: string): Promise<ServiceResponse<Notification[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      if (category) formData.append('kategori', category);
      if (detail) formData.append('kategoridetay', detail);
      const response = await this.client.post<any>('/0/0/bildirimler/gecmis/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(NotificationMapper.mapNotificationList(Array.isArray(icerik) ? icerik : []), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch notification history:', error);
      return this.createError(error.message);
    }
  }

  async getNotifications(): Promise<ServiceResponse<Notification[]>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/bildirim/0/0', new FormData());
      const icerik = Array.isArray(response) ? response : this.handle<any[]>(response);
      return this.createSuccess(NotificationMapper.mapNotificationList(icerik || []), (response as any)?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch notifications:', error);
      return this.createError(error.message);
    }
  }

  async updateAvatar(file: File | File[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('resim', Array.isArray(file) ? file[0] : file);
      const response = await this.client.post<any>('/0/0/ayarlar/profil-resmi-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Avatar update failed:', error);
      return this.createError(error.message);
    }
  }

  async resetAvatar(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/profil-resmi-sil/0/', new FormData());
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Avatar reset failed:', error);
      return this.createError(error.message);
    }
  }

  async resetBanner(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/ayarlar/profil-arkaplan-sil/0/', new FormData());
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Banner reset failed:', error);
      return this.createError(error.message);
    }
  }

  async resetWallpaper(): Promise<ServiceResponse<boolean>> {
    return this.createError('resetWallpaper is not supported in V1');
  }

  async updateBackground(file: File | File[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('resim', Array.isArray(file) ? file[0] : file);
      const response = await this.client.post<any>('/0/0/ayarlar/profil-arkaplan-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Background update failed:', error);
      return this.createError(error.message);
    }
  }

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
      this.logger.error('[UserServiceV1] Media rotation failed:', error);
      return this.createError(error.message);
    }
  }

  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('medyaID', mediaId.toString());
      const response = await this.client.post<any>('/0/0/medya/sil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Media deletion failed:', error);
      return this.createError(error.message);
    }
  }

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
      this.logger.error('[UserServiceV1] Media upload failed:', error);
      return this.createError(error.message);
    }
  }

  async getNotificationSettings(): Promise<ServiceResponse<NotificationSettings>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/0/0/bildirimler/ayarlar/liste/', new FormData());
      const icerik = this.handle<any>(response);
      return this.createSuccess(NotificationSettingsMapper.mapSettings(icerik || {}), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch notification settings:', error);
      return this.createError(error.message);
    }
  }

  async updateNotificationSettings(settings: Record<string, number>): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([k, v]) => formData.append(k, v.toString()));
      const response = await this.client.post<any>('/0/0/ayarlar/bildirim-guncelle/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to update notification settings:', error);
      return this.createError(error.message);
    }
  }

  async getXpRankings(page: number, limit?: number): Promise<ServiceResponse<RankingUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      const response = await this.client.post<any>('/0/0/xpsiralama/0/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.oyuncular || []);
      return this.createSuccess(UserMapper.mapXpRankingList(rawList), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch XP rankings:', error);
      return this.createError(error.message);
    }
  }

  async getPopRankings(page: number, limit?: number): Promise<ServiceResponse<RankingUser[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      const response = await this.client.post<any>('/0/0/popsiralama/0/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.oyuncular || []);
      return this.createSuccess(UserMapper.mapPopRankingList(rawList), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV1] Failed to fetch POP rankings:', error);
      return this.createError(error.message);
    }
  }
}
