import { BaseService } from '../services/BaseService';
import { MediaResponse, MediaUploadResultDTO, ServiceResponse } from '../models';
import { MediaCategory } from '../models/social/meta/MediaEnums';
import { MediaMapper } from '../utils/mappers/content/MediaMapper';

export class MediaServiceV2 extends BaseService {
  async getGallery(page: number = 1, _category: MediaCategory = MediaCategory.ALL, playerId?: number): Promise<ServiceResponse<MediaResponse[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (playerId !== undefined) query.set('playerId', playerId.toString());

      const response = await this.client.get<any>(`/v1/gallery?${query}`);
      const data = this.handle<any[]>(response);
      const mapped = MediaMapper.mapGalleryList(data || []);
      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MediaServiceV2] Failed to fetch gallery:', error.message);
      return this.createError(error.message);
    }
  }

  async getMediaDetail(mediaId: number): Promise<ServiceResponse<MediaResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/gallery/${mediaId}`);
      const data = this.handle<any>(response);
      const mapped = MediaMapper.mapGalleryItem(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaServiceV2] Failed to fetch media ${mediaId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async uploadMedia(files: File | File[], category: string = '-1'): Promise<ServiceResponse<MediaUploadResultDTO>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach(file => formData.append('file', file));
      } else {
        formData.append('file', files);
      }
      formData.append('category', category);

      const response = await this.client.post<any>('/v1/gallery/upload', formData);
      const data = this.handle<any>(response);
      const mapped = MediaMapper.mapUploadResult(data);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[MediaServiceV2] Media upload failed:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>('/v1/gallery/remove', { mediaId });
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaServiceV2] Failed to delete media ${mediaId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async rotateMedia(photoId: number, degree: number = 90): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/gallery/${photoId}/rotate`, { degrees: degree });
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaServiceV2] Failed to rotate media ${photoId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
