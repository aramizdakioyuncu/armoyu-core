import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { User, RankingUser, MediaResponse, Notification, NotificationSettings, InviteCodeCheckResponse, School } from '../models';
import { UserServiceV1, UpdatePersonalInfoParams } from '../v1/UserServiceV1';
import { UserServiceV2 } from '../v2/UserServiceV2';

export { UpdatePersonalInfoParams };

export class UserService extends BaseService {
  private version: UserServiceV1 | UserServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new UserServiceV1(client, logger)
      : new UserServiceV2(client, logger);
  }

  async getOwnProfile(): Promise<ServiceResponse<User>> {
    return this.version.getOwnProfile();
  }

  async getUserByUsername(username: string): Promise<ServiceResponse<User>> {
    return this.version.getUserByUsername(username);
  }

  async updatePrivatePersonalInfo(data: UpdatePersonalInfoParams): Promise<ServiceResponse<boolean>> {
    return this.version.updateSpecialPersonalInfo(data);
  }

  async updateSpecialPersonalInfo(data: UpdatePersonalInfoParams): Promise<ServiceResponse<boolean>> {
    return this.version.updateSpecialPersonalInfo(data);
  }

  async getFriendsList(page: number, options?: { userId?: number; limit?: number }): Promise<ServiceResponse<RankingUser[]>> {
    return this.version.getFriendsList(page, options);
  }

  async addFriend(userId: number): Promise<ServiceResponse<boolean>> {
    return this.version.addFriend(userId);
  }

  async removeFriend(userId: number): Promise<ServiceResponse<boolean>> {
    return this.version.removeFriend(userId);
  }

  async respondToFriendRequest(userId: number, answer: number): Promise<ServiceResponse<boolean>> {
    return this.version.respondToFriendRequest(userId, answer);
  }

  async getUserSchools(userId?: number): Promise<ServiceResponse<School[]>> {
    return this.version.getUserSchools(userId);
  }

  async getSchoolDetail(schoolId: number): Promise<ServiceResponse<School | null>> {
    return this.version.getSchoolDetail(schoolId);
  }

  async getInvitationsList(page: number): Promise<ServiceResponse<any[]>> {
    return this.version.getInvitationsList(page);
  }

  async refreshInviteCode(): Promise<ServiceResponse<string>> {
    return this.version.refreshInviteCode();
  }

  async sendVerificationEmail(userId: string | number): Promise<ServiceResponse<boolean>> {
    return this.version.sendVerificationEmail(userId);
  }

  async checkInviteCode(code: string): Promise<ServiceResponse<InviteCodeCheckResponse>> {
    return this.version.checkInviteCode(code);
  }

  async requestEmailVerificationUrl(userId?: number): Promise<ServiceResponse<boolean>> {
    return this.version.requestEmailVerificationUrl(userId);
  }

  async pokeFriend(userId: number): Promise<ServiceResponse<boolean>> {
    return this.version.pokeFriend(userId);
  }

  async setFavoriteTeam(teamId: number): Promise<ServiceResponse<boolean>> {
    return this.version.setFavoriteTeam(teamId);
  }

  async getSocialProfile(userId?: number): Promise<ServiceResponse<any>> {
    return this.version.getSocialProfile(userId);
  }

  async getUserMedia(page: number, options?: { userId?: number; limit?: number; category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    return this.version.getUserMedia(page, options);
  }

  async getUserMediaLegacy(page: number, options?: { userId?: number; limit?: number; category?: string }): Promise<ServiceResponse<MediaResponse[]>> {
    return this.version.getUserMedia(page, options);
  }

  async getNotificationsHistory(page: number, limit: number = 20, category?: string, detail?: string): Promise<ServiceResponse<Notification[]>> {
    return this.version.getNotificationsHistory(page, limit, category, detail);
  }

  async getNotifications(): Promise<ServiceResponse<Notification[]>> {
    return this.version.getNotifications();
  }

  async updateAvatar(file: File | File[]): Promise<ServiceResponse<boolean>> {
    return this.version.updateAvatar(file);
  }

  async resetAvatar(): Promise<ServiceResponse<boolean>> {
    return this.version.resetAvatar();
  }

  async resetBanner(): Promise<ServiceResponse<boolean>> {
    return this.version.resetBanner();
  }

  async resetWallpaper(): Promise<ServiceResponse<boolean>> {
    return this.version.resetWallpaper();
  }

  async updateBackground(file: File | File[]): Promise<ServiceResponse<boolean>> {
    return this.version.updateBackground(file);
  }

  async rotateMedia(mediaId: number, degree: number): Promise<ServiceResponse<boolean>> {
    return this.version.rotateMedia(mediaId, degree);
  }

  async getMediaUsage(): Promise<ServiceResponse<any>> {
    return this.usePreviousVersion
      ? this.createError('getMediaUsage is only available in V2')
      : (this.version as UserServiceV2).getMediaUsage();
  }

  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteMedia(mediaId);
  }

  async uploadMedia(files: File[], category?: string): Promise<ServiceResponse<boolean>> {
    return this.version.uploadMedia(files, category);
  }

  async getNotificationSettings(): Promise<ServiceResponse<NotificationSettings>> {
    return this.version.getNotificationSettings();
  }

  async updateNotificationSettings(settings: Record<string, number>): Promise<ServiceResponse<boolean>> {
    return this.version.updateNotificationSettings(settings);
  }

  async getXpRankings(page: number, limit?: number): Promise<ServiceResponse<RankingUser[]>> {
    return this.version.getXpRankings(page, limit);
  }

  async getPopRankings(page: number, limit?: number): Promise<ServiceResponse<RankingUser[]>> {
    return this.version.getPopRankings(page, limit);
  }
}
