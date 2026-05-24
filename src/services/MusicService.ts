import { BaseService } from './BaseService';
import { SongResponse, ServiceResponse } from '../models';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { MusicServiceV1 } from '../v1/MusicServiceV1';
import { MusicServiceV2, UpdateSongParams } from '../v2/MusicServiceV2';

export { UpdateSongParams };

export class MusicService extends BaseService {
  private version: MusicServiceV1 | MusicServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new MusicServiceV1(client, logger)
      : new MusicServiceV2(client, logger);
  }

  async getSongs(page: number = 1, category: string = 'oynatilabilir', limit: number = 10, query?: string): Promise<ServiceResponse<SongResponse[]>> {
    return this.version.getSongs(page, category, limit, query);
  }

  async getSongDetail(id: number): Promise<ServiceResponse<SongResponse>> {
    return this.version.getSongDetail(id);
  }

  async searchSongs(query: string, page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    return this.version.searchSongs(query, page, limit);
  }

  async getFavoriteSongs(page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    return this.version.getFavoriteSongs(page, limit);
  }

  async getLiveSongs(page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    return this.version.getLiveSongs(page, limit);
  }

  async addSong(name: string, link: string = ''): Promise<ServiceResponse<SongResponse | boolean>> {
    return this.version.addSong(name, link);
  }

  async updateSong(id: number, params: UpdateSongParams): Promise<ServiceResponse<boolean>> {
    if (this.version instanceof MusicServiceV2) {
      return this.version.updateSong(id, params);
    }
    return this.createError('updateSong is not supported in V1');
  }

  async deleteSong(id: number): Promise<ServiceResponse<boolean>> {
    if (this.version instanceof MusicServiceV2) {
      return this.version.deleteSong(id);
    }
    return this.createError('deleteSong is not supported in V1');
  }

  async addFavorite(musicId: number): Promise<ServiceResponse<boolean>> {
    return this.version.addFavorite(musicId);
  }

  async removeFavorite(musicId: number): Promise<ServiceResponse<boolean>> {
    return this.version.removeFavorite(musicId);
  }
}
