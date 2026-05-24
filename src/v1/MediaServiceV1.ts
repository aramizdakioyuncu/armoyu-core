import { BaseService } from '../services/BaseService';
import { MediaResponse, MediaUploadResultDTO, ServiceResponse } from '../models';
import { MediaCategory } from '../models/social/meta/MediaEnums';
import { MediaMapper } from '../utils/mappers/content/MediaMapper';

export class MediaServiceV1 extends BaseService {
  async getGallery(page: number = 1, category: MediaCategory = MediaCategory.ALL, _playerId?: number): Promise<ServiceResponse<MediaResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/medya/0/0/', formData);
      const data = this.handle<any[]>(response);
      const mapped = MediaMapper.mapGalleryList(data || []);
      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MediaServiceV1] Failed to fetch gallery:', error.message);
      return this.createError(error.message);
    }
  }

  async getMediaDetail(_mediaId: number): Promise<ServiceResponse<MediaResponse>> {
    return this.createError('getMediaDetail is not supported in V1');
  }

  async uploadMedia(files: File | File[], category: string = '-1'): Promise<ServiceResponse<MediaUploadResultDTO>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach(file => formData.append('media[]', file));
      } else {
        formData.append('media[]', files);
      }
      formData.append('category', category);

      const response = await this.client.post<any>('/0/0/medya/yukle/0/', formData);
      this.handle<any>(response);
      return this.createSuccess({ url: '', key: '', mediaId: 0, category, fileType: '', fileSize: '' }, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[MediaServiceV1] Media upload failed:', error.message);
      return this.createError(error.message);
    }
  }

  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('medyaID', mediaId.toString());

      const response = await this.client.post<any>('/0/0/medya/sil/0/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaServiceV1] Failed to delete media ${mediaId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async rotateMedia(photoId: number, degree: number = 90): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('fotografID', photoId.toString());
      formData.append('derece', degree.toString());

      const response = await this.client.post<any>('/0/0/medya/donder/0/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaServiceV1] Failed to rotate photo ${photoId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
