import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles story management actions (Add, Delete, View, Like).
 */
export class StoryActionService extends BaseService {
  async addStory(mediaUrl: string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayemedya', mediaUrl);
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/ekle/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async deleteStory(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/sil/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async hideStory(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/gizle/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async viewStory(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/bak/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async addLike(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begeni-ekle/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async removeLike(storyId: number | string): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/hikaye/begeni-sil/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
