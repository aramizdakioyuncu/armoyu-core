import { BaseService } from './BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { MediaResponse, MediaCategory } from '../models';
import { MediaMapper } from '../utils/mappers';

/**
 * Service for Media operations, Gallery management, and Profile visuals.
 */
export class MediaService extends BaseService {
  /**
   * Get gallery items.
   * @param page Page number
   * @param category Media category (e.g., 'all', 'user', etc.)
   * @returns List of media items
   */
  async getGallery(page: number = 1, category: MediaCategory = MediaCategory.ALL): Promise<ServiceResponse<MediaResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('kategori', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/0/0/'), formData);
      const icerik = this.handle<any[]>(response);
      const mapped = MediaMapper.mapGalleryList(icerik);

      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MediaService] Failed to fetch gallery:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Upload media to user gallery.
   * @param files Files to upload
   * @param category Media category
   */
  async uploadMedia(files: File | File[], category: string = "-1"): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach(file => formData.append('media[]', file));
      } else {
        formData.append('media[]', files);
      }
      formData.append('category', category);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/yukle/0/'), formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[MediaService] Media upload failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a media item from gallery.
   * @param mediaId ID of the media to delete
   */
  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('medyaID', mediaId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/sil/0/'), formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaService] Failed to delete media ${mediaId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Rotate a media photo.
   * @param photoId ID of the photo
   * @param degree Rotation degree (e.g., 90, 180)
   */
  async rotateMedia(photoId: number, degree: number = 90): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('fotografID', photoId.toString());
      formData.append('derece', degree.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/medya/donder/0/'), formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MediaService] Failed to rotate photo ${photoId}:`, error);
      return this.createError(error.message);
    }
  }
}
