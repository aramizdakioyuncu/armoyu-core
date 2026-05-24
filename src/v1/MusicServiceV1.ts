import { BaseService } from '../services/BaseService';
import { SongResponse, ServiceResponse } from '../models';
import { MusicMapper } from '../utils/mappers/content/MusicMapper';
export class MusicServiceV1 extends BaseService {
  async getSongs(page: number = 1, category: string = 'oynatilabilir', limit: number = 10, _query?: string): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/muzikler/0/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(MusicMapper.mapSongList(data || []), response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicServiceV1] Failed to fetch songs:', error.message);
      return this.createError(error.message);
    }
  }

  async getSongDetail(_id: number): Promise<ServiceResponse<SongResponse>> {
    return this.createError('getSongDetail is not supported in V1');
  }

  async searchSongs(query: string, _page: number = 1, _limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sarkibilgi', query);

      const response = await this.client.post<any>('/0/0/muzikler/bul/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(MusicMapper.mapSearchList(data || []), response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV1] Search failed for "${query}":`, error.message);
      return this.createError(error.message);
    }
  }

  async getFavoriteSongs(page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/muzikler/favoriler/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(MusicMapper.mapFavoriteList(data || []), response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicServiceV1] Failed to fetch favorite songs:', error.message);
      return this.createError(error.message);
    }
  }

  async getLiveSongs(page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/muzikler/canli/0/', formData);
      const data = this.handle<any[]>(response);
      return this.createSuccess(MusicMapper.mapLiveList(data || []), response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicServiceV1] Failed to fetch live songs:', error.message);
      return this.createError(error.message);
    }
  }

  async addSong(name: string, link: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('muzikadi', name);
      formData.append('muziklink', link);

      const response = await this.client.post<any>('/0/0/muzikler/ekle/0/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV1] Failed to add song "${name}":`, error.message);
      return this.createError(error.message);
    }
  }

  async addFavorite(musicId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('muzikID', musicId.toString());

      const response = await this.client.post<any>('/0/0/muzikler/favoriler/ekle/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV1] Failed to add song ${musicId} to favorites:`, error.message);
      return this.createError(error.message);
    }
  }

  async removeFavorite(musicId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('muzikID', musicId.toString());

      const response = await this.client.post<any>('/0/0/muzikler/favoriler/sil/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicServiceV1] Failed to remove song ${musicId} from favorites:`, error.message);
      return this.createError(error.message);
    }
  }
}
