import { BaseService } from '../services/BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { User, RankingUser, MediaResponse, Notification, NotificationSettings, InviteCodeCheckResponse, School } from '../models';
import { UserMapper } from '../utils/mappers/user/UserMapper';
import { UpdatePersonalInfoParams } from '../v1/UserServiceV1';

export class UserServiceV2 extends BaseService {
  async getOwnProfile(): Promise<ServiceResponse<User>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/profile');
      const data = this.handle<any>(response);
      return this.createSuccess(UserMapper.mapProfile(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch own profile:', error.message);
      return this.createError(error.message);
    }
  }

  async getUserByUsername(username: string): Promise<ServiceResponse<User>> {
    try {
      const response = await this.client.get<any>(`/v1/profile/by-username/${encodeURIComponent(username)}`);
      return this.createSuccess(UserMapper.mapProfile(this.handle<any>(response)), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV2] Failed to fetch profile ${username}:`, error.message);
      return this.createError(error.message);
    }
  }

  async updateSpecialPersonalInfo(data: UpdatePersonalInfoParams): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const body: any = {
        ad: data.ad || '',
        soyad: data.soyad || '',
        email: data.email || '',
        birthday: data.birthday || '',
        phoneNumber: data.phoneNumber || '',
        countryID: data.countryID ?? '',
        provinceID: data.provinceID ?? '',
        passwordControl: data.passwordControl
      };
      const response = await this.client.put<any>('/v1/profile/ozelbilgiler', body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Update personal info failed:', error.message);
      return this.createError(error.message);
    }
  }

  async getPrivatePersonalInfo(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/profile/ozelbilgiler');
      return this.createSuccess(this.handle<any>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch personal info:', error.message);
      return this.createError(error.message);
    }
  }

  async getFriendsList(_page: number, _options?: { userId?: number; limit?: number }): Promise<ServiceResponse<RankingUser[]>> {
    return this.createError('getFriendsList is not supported in V2 yet');
  }

  async addFriend(_userId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('addFriend is not supported in V2 yet');
  }

  async removeFriend(_userId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('removeFriend is not supported in V2 yet');
  }

  async respondToFriendRequest(_userId: number, _answer: number): Promise<ServiceResponse<boolean>> {
    return this.createError('respondToFriendRequest is not supported in V2 yet');
  }

  async getUserSchools(_userId?: number): Promise<ServiceResponse<School[]>> {
    return this.createError('getUserSchools is not supported in V2 yet');
  }

  async getSchoolDetail(_schoolId: number): Promise<ServiceResponse<School | null>> {
    return this.createError('getSchoolDetail is not supported in V2 yet');
  }

  async getInvitationsList(_page: number): Promise<ServiceResponse<any[]>> {
    return this.createError('getInvitationsList is not supported in V2 yet');
  }

  async refreshInviteCode(): Promise<ServiceResponse<string>> {
    return this.createError('refreshInviteCode is not supported in V2 yet');
  }

  async sendVerificationEmail(_userId: string | number): Promise<ServiceResponse<boolean>> {
    return this.createError('sendVerificationEmail is not supported in V2 yet');
  }

  async checkInviteCode(_code: string): Promise<ServiceResponse<InviteCodeCheckResponse>> {
    return this.createError('checkInviteCode is not supported in V2 yet');
  }

  async requestEmailVerificationUrl(_userId?: number): Promise<ServiceResponse<boolean>> {
    return this.createError('requestEmailVerificationUrl is not supported in V2 yet');
  }

  async pokeFriend(_userId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('pokeFriend is not supported in V2 yet');
  }

  async setFavoriteTeam(_teamId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('setFavoriteTeam is not supported in V2 yet');
  }

  async getSocialProfile(_userId?: number): Promise<ServiceResponse<any>> {
    return this.createError('getSocialProfile is not supported in V2 yet');
  }

  async getUserMedia(page: number, options?: { userId?: number; limit?: number; category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());
      if (options?.category) query.set('category', options.category);
      const response = await this.client.get<any>(`/v1/gallery/mine?${query}`);
      return this.createSuccess(this.handle<MediaResponse[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch media:', error.message);
      return this.createError(error.message);
    }
  }

  async getMediaUsage(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>('/v1/gallery/usage');
      return this.createSuccess(this.handle<any>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch media usage:', error.message);
      return this.createError(error.message);
    }
  }

  async getNotificationsHistory(_page: number, _limit?: number, _category?: string, _detail?: string): Promise<ServiceResponse<Notification[]>> {
    return this.createError('getNotificationsHistory is not supported in V2 yet');
  }

  async getNotifications(): Promise<ServiceResponse<Notification[]>> {
    return this.createError('getNotifications is not supported in V2 yet');
  }

  async updateAvatar(file: File | File[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('file', Array.isArray(file) ? file[0] : file);
      const response = await this.client.post<any>('/v1/profile/avatar', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Avatar upload failed:', error.message);
      return this.createError(error.message);
    }
  }

  async resetAvatar(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/profile/reset-avatar', {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Avatar reset failed:', error.message);
      return this.createError(error.message);
    }
  }

  async resetBanner(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/profile/reset-banner', {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Banner reset failed:', error.message);
      return this.createError(error.message);
    }
  }

  async resetWallpaper(): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/profile/reset-wallpaper', {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Wallpaper reset failed:', error.message);
      return this.createError(error.message);
    }
  }

  /** Profil kapak fotoğrafı (V1'deki profil arka planı) */
  async updateBackground(file: File | File[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('file', Array.isArray(file) ? file[0] : file);
      const response = await this.client.post<any>('/v1/profile/banner', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Banner upload failed:', error.message);
      return this.createError(error.message);
    }
  }

  async rotateMedia(_mediaId: number, _degree: number): Promise<ServiceResponse<boolean>> {
    return this.createError('rotateMedia is not supported in V2 yet');
  }

  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/gallery/items/${mediaId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV2] Failed to delete media ${mediaId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /** category === 'public': dosya herkese açık olur */
  async uploadMedia(files: File[], category?: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('is_public', String(category === 'public'));
      const response = await this.client.post<any>('/v1/gallery/upload', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to upload media:', error.message);
      return this.createError(error.message);
    }
  }

  async getNotificationSettings(): Promise<ServiceResponse<NotificationSettings>> {
    return this.createError('getNotificationSettings is not supported in V2 yet');
  }

  async updateNotificationSettings(_settings: Record<string, number>): Promise<ServiceResponse<boolean>> {
    return this.createError('updateNotificationSettings is not supported in V2 yet');
  }

  async getXpRankings(page: number, limit: number = 10): Promise<ServiceResponse<RankingUser[]>> {
    return this.getRankings('level', page, limit);
  }

  async getPopRankings(page: number, limit: number = 10): Promise<ServiceResponse<RankingUser[]>> {
    return this.getRankings('popularity', page, limit);
  }

  private async getRankings(type: 'level' | 'popularity', page: number, limit: number): Promise<ServiceResponse<RankingUser[]>> {
    try {
      const response = await this.client.get<any>(`/v1/profile/rankings/${type}?page=${page}&limit=${limit}`);
      const list = this.handle<any[]>(response) || [];
      return this.createSuccess(
        // id UUID'dir; RankingUser tipi eski sayısal kimliği bekliyor
        list.map((raw, i) => new RankingUser({ ...raw, rank: (page - 1) * limit + i + 1, id: raw.id as any })),
        response?.aciklama,
      );
    } catch (error: any) {
      this.logger.error(`[UserServiceV2] Failed to fetch ${type} rankings:`, error.message);
      return this.createError(error.message);
    }
  }
}
