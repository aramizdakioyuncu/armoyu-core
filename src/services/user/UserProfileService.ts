import { UserMapper } from '../../utils/mappers/UserMapper';
import { User } from '../../models/auth/User';
import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles user profile information and management.
 */
export class UserProfileService extends BaseService {
  async getUserByUsername(username: string): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakusername', username);
      const finalPath = this.resolveBotPath('/0/0/0/');
      console.log(`[UserProfileService] Requesting: ${finalPath} with username: ${username}`);
      const response = await this.client.post<any>(finalPath, formData);
      const data = this.handle(response);
      console.log("[UserProfileService] Full Data Received (Keys):", Object.keys(data || {}));
      return this.createSuccess(data, response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getSocialProfile(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId !== undefined) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sosyal/profil/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async updateProfile(data: Partial<User>): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/users/me/update', data);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async updatePrivatePersonalInfo(data: any): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('v1', '1');
      Object.entries(data).forEach(([key, val]) => formData.append(key, String(val || '')));
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/ozelbilgiler/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async setFavoriteTeam(teamId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('favoritakimID', teamId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/favoritakimsec/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async requestEmailVerificationUrl(userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) formData.append('userID', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/profil/maildogrulamaURL/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getPermissions(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/yetkiler/0/0/'), {});
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
