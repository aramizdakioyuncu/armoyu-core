import { BaseService } from './BaseService';
import { MediaResponse, MediaUploadResultDTO, ServiceResponse } from '../models';
import { MediaCategory } from '../models/social/meta/MediaEnums';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { MediaServiceV1 } from '../v1/MediaServiceV1';
import { MediaServiceV2 } from '../v2/MediaServiceV2';

export class MediaService extends BaseService {
  private version: MediaServiceV1 | MediaServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new MediaServiceV1(client, logger)
      : new MediaServiceV2(client, logger);
  }

  async getGallery(page: number = 1, category: MediaCategory = MediaCategory.ALL, playerId?: number): Promise<ServiceResponse<MediaResponse[]>> {
    return this.version.getGallery(page, category, playerId);
  }

  async getMediaDetail(mediaId: number): Promise<ServiceResponse<MediaResponse>> {
    return this.version.getMediaDetail(mediaId);
  }

  async uploadMedia(files: File | File[], category: string = '-1'): Promise<ServiceResponse<MediaUploadResultDTO>> {
    return this.version.uploadMedia(files, category);
  }

  async deleteMedia(mediaId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteMedia(mediaId);
  }

  async rotateMedia(photoId: number, degree: number = 90): Promise<ServiceResponse<boolean>> {
    return this.version.rotateMedia(photoId, degree);
  }
}
