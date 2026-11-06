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
        passwordControl: data.passwordControl,
        // Gönderilmezse backend cinsiyete dokunmaz
        ...(data.gender !== undefined ? { gender: data.gender } : {})
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

  /** Yalnızca kendi arkadaş listesi döner; başkasınınki boş (eklenti satır kuralı) */
  async getFriendsList(page: number, options?: { userId?: number | string; limit?: number }): Promise<ServiceResponse<RankingUser[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ page: String(page), limit: String(options?.limit ?? 20) });
      if (options?.userId) query.set('userId', String(options.userId));
      const response = await this.client.get<any>(`/v1/profile/friends?${query}`);
      return this.createSuccess(this.handle<any[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch friends:', error.message);
      return this.createError(error.message);
    }
  }

  private async friendRequest(method: 'post' | 'put' | 'delete', body: Record<string, unknown>, label: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client[method]<any>('/v1/profile/friends', body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[UserServiceV2] ${label} failed:`, error.message);
      return this.createError(error.message);
    }
  }

  async addFriend(userId: number | string): Promise<ServiceResponse<boolean>> {
    return this.friendRequest('post', { userid: userId }, 'Friend request');
  }

  async removeFriend(userId: number | string): Promise<ServiceResponse<boolean>> {
    return this.friendRequest('delete', { userid: userId }, 'Friend removal');
  }

  /** answer: 1 kabul, 0 ret */
  async respondToFriendRequest(userId: number | string, answer: number): Promise<ServiceResponse<boolean>> {
    return this.friendRequest('put', { userid: userId, answer }, 'Friend response');
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

  /** Favori takım kataloğu (panelden yönetilir) */
  async getTeams(): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.client.get<any>('/v1/profile/teams');
      return this.createSuccess(this.handle<any[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch teams:', error.message);
      return this.createError(error.message);
    }
  }

  private async profileWrite(method: 'post' | 'put' | 'delete', path: string, body?: Record<string, unknown>): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client[method]<any>(`/v1/profile${path}`, body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Profile update failed:', error.message);
      return this.createError(error.message);
    }
  }

  /** favoriteTeamId / soulmateUserId; null kaldırır, verilmeyen değişmez */
  async updateProfileChoices(choices: { favoriteTeamId?: string | null; soulmateUserId?: string | null; bio?: string | null }): Promise<ServiceResponse<boolean>> {
    return this.profileWrite('put', '/secimler', choices);
  }

  async addEducation(education: { schoolName: string; kind?: string; department?: string; startYear?: number; endYear?: number }): Promise<ServiceResponse<boolean>> {
    return this.profileWrite('post', '/education', education);
  }

  async removeEducation(educationId: string): Promise<ServiceResponse<boolean>> {
    return this.profileWrite('delete', `/education/${encodeURIComponent(educationId)}`);
  }

  /** Profil vitrini (Medya): kişinin vitrine koyduğu Bulut dosyaları */
  async getShowcase(userId: number | string, page: number = 1, limit: number = 24): Promise<ServiceResponse<MediaResponse[]>> {
    try {
      const response = await this.client.get<any>(`/v1/gallery/showcase/${encodeURIComponent(String(userId))}?page=${page}&limit=${limit}`);
      return this.createSuccess(this.handle<MediaResponse[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch showcase:', error.message);
      return this.createError(error.message);
    }
  }

  async setShowcase(mediaId: string, show: boolean): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>(`/v1/gallery/items/${encodeURIComponent(mediaId)}/showcase`, { show });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to update showcase:', error.message);
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

  /** Bildirim geçmişi (sayfalı); ilk sayfada bekleyen arkadaşlık istekleri de var */
  async getNotificationsHistory(page: number, limit: number = 20, _category?: string, _detail?: string): Promise<ServiceResponse<Notification[]>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/notification/inbox?page=${page}&limit=${limit}`);
      const list = this.handle<any[]>(response) || [];
      return this.createSuccess(list.map((n) => new Notification(n)), response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch notification history:', error.message);
      return this.createError(error.message);
    }
  }

  /** ids verilmezse hepsi okundu olur */
  async markNotificationsRead(ids?: (string | number)[]): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/notification/read', ids?.length ? { ids } : {});
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to mark notifications read:', error.message);
      return this.createError(error.message);
    }
  }

  /** Profil soru-cevap (Phatsa Sorular): sahibi bekleyenler dahil hepsini, başkası yayınlanmış cevapları görür */
  async getQuestions(userId: number | string): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.client.get<any>(`/v1/profile/questions/${encodeURIComponent(String(userId))}`);
      return this.createSuccess(this.handle<any[]>(response) || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Failed to fetch questions:', error.message);
      return this.createError(error.message);
    }
  }

  private async questionRequest(method: 'post' | 'put' | 'delete', path: string, body?: Record<string, unknown>): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client[method]<any>(`/v1/profile/questions${path}`, body);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[UserServiceV2] Question request failed:', error.message);
      return this.createError(error.message);
    }
  }

  async askQuestion(userId: number | string, body: string, isAnonymous: boolean = true): Promise<ServiceResponse<boolean>> {
    return this.questionRequest('post', '', { receiverId: userId, body, isAnonymous });
  }

  async answerQuestion(questionId: string, answer: string): Promise<ServiceResponse<boolean>> {
    return this.questionRequest('put', `/${encodeURIComponent(questionId)}`, { answer });
  }

  async deleteQuestion(questionId: string): Promise<ServiceResponse<boolean>> {
    return this.questionRequest('delete', `/${encodeURIComponent(questionId)}`);
  }

  /** Bildirim zili: son 20 (bekleyen arkadaşlık istekleri type: friend_request, sender.id = isteği gönderen) */
  async getNotifications(): Promise<ServiceResponse<Notification[]>> {
    return this.getNotificationsHistory(1, 20);
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
