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

  async getUserByUsername(_username: string): Promise<ServiceResponse<User>> {
    return this.createError('getUserByUsername is not supported in V2 yet');
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

  async getUserMedia(_page: number, _options?: { userId?: number; limit?: number; category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    return this.createError('getUserMedia is not supported in V2 yet');
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

  async updateBackground(_file: File | File[]): Promise<ServiceResponse<boolean>> {
    return this.createError('updateBackground is not supported in V2 yet');
  }

  async rotateMedia(_mediaId: number, _degree: number): Promise<ServiceResponse<boolean>> {
    return this.createError('rotateMedia is not supported in V2 yet');
  }

  async deleteMedia(_mediaId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('deleteMedia is not supported in V2 yet');
  }

  async uploadMedia(_files: File[], _category?: string): Promise<ServiceResponse<boolean>> {
    return this.createError('uploadMedia is not supported in V2 yet');
  }

  async getNotificationSettings(): Promise<ServiceResponse<NotificationSettings>> {
    return this.createError('getNotificationSettings is not supported in V2 yet');
  }

  async updateNotificationSettings(_settings: Record<string, number>): Promise<ServiceResponse<boolean>> {
    return this.createError('updateNotificationSettings is not supported in V2 yet');
  }

  async getXpRankings(_page: number, _limit?: number): Promise<ServiceResponse<RankingUser[]>> {
    return this.createError('getXpRankings is not supported in V2 yet');
  }

  async getPopRankings(_page: number, _limit?: number): Promise<ServiceResponse<RankingUser[]>> {
    return this.createError('getPopRankings is not supported in V2 yet');
  }
}
