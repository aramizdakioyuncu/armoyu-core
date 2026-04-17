import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles story fetching and listings (Viewers, Likers).
 */
export class StoryQueryService extends BaseService {
  async getStories(page: number, limit?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/hikaye/${page}/${limit || 0}/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getStoryViewers(page: number, storyId: number | string, limit?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/hikaye/goruntuleyenler/${page}/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getStoryLikers(page: number, storyId: number | string, limit?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('hikayeID', storyId.toString());
      formData.append('sayfa', page.toString());
      if (limit !== undefined) formData.append('limit', limit.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/hikaye/begenenler/${page}/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
