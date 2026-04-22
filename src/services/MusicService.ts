import { BaseService } from './BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { SongResponse } from '../models';
import { MusicMapper } from '../utils/mappers';

/**
 * Service for Music & Songs.
 */
export class MusicService extends BaseService {
  /**
   * Get list of songs.
   * @param page Page number
   * @param category Category (e.g., 'oynatilabilir')
   * @param limit Results per page
   * @returns List of songs
   */
  async getSongs(page: number = 1, category: string = 'oynatilabilir', limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());
      formData.append('kategori', category);

      const response = await this.client.post<any>('/0/0/muzikler/0/0/', formData);
      const icerik = this.handle<any[]>(response);
      const mapped = MusicMapper.mapSongList(icerik);

      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicService] Failed to fetch songs:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get favorite songs.
   * @param page Page number
   * @param limit Items per page
   * @returns List of favorite songs
   */
  async getFavoriteSongs(page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/muzikler/favoriler/0/', formData);
      const icerik = this.handle<any[]>(response);
      const mapped = MusicMapper.mapFavoriteList(icerik);

      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicService] Failed to fetch favorite songs:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Add a new song to the system.
   * @param name Song name (muzikadi)
   * @param link Song link/search query (muziklink)
   */
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
      this.logger.error(`[MusicService] Failed to add song "${name}":`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get live playing/queue songs.
   * @param page Page number
   * @param limit Items per page
   */
  async getLiveSongs(page: number = 1, limit: number = 10): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      formData.append('limit', limit.toString());

      const response = await this.client.post<any>('/0/0/muzikler/canli/0/', formData);
      const icerik = this.handle<any[]>(response);
      const mapped = MusicMapper.mapLiveList(icerik);

      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[MusicService] Failed to fetch live songs:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Search for songs.
   * @param query Search query (sarkibilgi)
   * @returns List of found songs
   */
  async searchSongs(query: string): Promise<ServiceResponse<SongResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sarkibilgi', query);

      const response = await this.client.post<any>('/0/0/muzikler/bul/0/', formData);
      const icerik = this.handle<any[]>(response);
      const mapped = MusicMapper.mapSearchList(icerik);

      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error(`[MusicService] Search failed for "${query}":`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Add a song to favorites.
   */
  async addFavorite(musicId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('muzikID', musicId.toString());
      const response = await this.client.post<any>('/0/0/muzikler/favoriler/ekle/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicService] Failed to add song ${musicId} to favorites:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Remove a song from favorites.
   */
  async removeFavorite(musicId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('muzikID', musicId.toString());
      const response = await this.client.post<any>('/0/0/muzikler/favoriler/sil/', formData);
      this.handle<any>(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[MusicService] Failed to remove song ${musicId} from favorites:`, error);
      return this.createError(error.message);
    }
  }
}

