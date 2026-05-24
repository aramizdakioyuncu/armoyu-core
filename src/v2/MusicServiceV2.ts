import { BaseService } from '../services/BaseService';
import { SongResponse, ServiceResponse } from '../models';
import { MusicMapper } from '../utils/mappers/content/MusicMapper';

export interface UpdateSongParams {
  muzikadi?: string;
  muzik_sahipbilgi?: string;
  muziklink?: string;
}

export class MusicServiceV2 extends BaseService {
  async getSongs(page: number = 1, _category: string = '', limit: number = 10, query?: string): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const q = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (query) q.set('q', query);

      const response = await this.client.get<any>(`/v1/muzikler?${q}`);
      const data = this.handle<any[]>(response);
      return this.createSuccess(MusicMapper.mapSongList(data || []), response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicServiceV2] Failed to fetch songs:', error.message);
      return this.createError(error.message);
    }
  }

  async getSongDetail(id: number): Promise<ServiceResponse<SongResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.get<any>(`/v1/muzikler/${id}`);
      const data = this.handle<any>(response);
      return this.createSuccess(MusicMapper.mapSongItem(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV2] Failed to fetch song ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async searchSongs(query: string, page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    return this.getSongs(page, '', limit, query);
  }

  async addSong(name: string, _link: string = ''): Promise<ServiceResponse<SongResponse>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/muzikler', { muzikadi: name });
      const data = this.handle<any>(response);
      return this.createSuccess(MusicMapper.mapSongItem(data), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV2] Failed to add song "${name}":`, error.message);
      return this.createError(error.message);
    }
  }

  async updateSong(id: number, params: UpdateSongParams): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>(`/v1/muzikler/${id}`, params);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV2] Failed to update song ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async deleteSong(id: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>(`/v1/muzikler/${id}`);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV2] Failed to delete song ${id}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getFavoriteSongs(_page: number = 1, _limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    return this.createError('getFavoriteSongs is not supported in V2 yet');
  }

  async getLiveSongs(_page: number = 1, _limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    return this.createError('getLiveSongs is not supported in V2 yet');
  }

  async addFavorite(_musicId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('addFavorite is not supported in V2 yet');
  }

  async removeFavorite(_musicId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('removeFavorite is not supported in V2 yet');
  }
}
