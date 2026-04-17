import { UserMapper } from '../../utils/mappers/UserMapper';
import { User } from '../../models/auth/User';
import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';
import { GetFriendsResponse } from '../../models/user/GetFriendsResponse';

/**
 * Handles user social interactions (Friends, Following, Search).
 */
export class UserSocialService extends BaseService {
  async search(query: string): Promise<ServiceResponse<User[]>> {
    try {
      const response = await this.client.get<any>(`/users/search`, { params: { q: query } });
      const mapped = (this.handle<any[]>(response) || []).map(item => UserMapper.mapUser(item, this.usePreviousVersion));
      return this.createSuccess(mapped);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async toggleFollow(userId: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/users/${userId}/follow`, {});
      return this.createSuccess(this.handle<{ following: boolean }>(response).following, response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async addFriend(userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-ol/0/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async removeFriend(userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-cikar/0/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async respondToFriendRequest(userId: number, response: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('cevap', response.toString());
      const responseApi = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-cevap/0/0/'), formData);
      return this.createSuccess(this.handle(responseApi), responseApi?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getFriendsList(page: number, params: { userId?: number, limit?: number } = {}): Promise<GetFriendsResponse> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', (params.limit || 100).toString());
      if (params.userId !== undefined) formData.append('oyuncubakid', params.userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/arkadaslarim/${page}/0/`), formData);
      return { icerik: (this.handle<any[]>(response) || []).map(item => UserMapper.mapUser(item, this.usePreviousVersion)), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı', kod: Number(response.kod || 0) };
    } catch (error: any) {
      return { icerik: [], durum: 0, aciklama: error.message, kod: 0 };
    }
  }

  async pokeFriend(userId: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/arkadas-durt/0/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
