import { SongResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Music & Songs.
 * Specialized for each endpoint.
 */
export class MusicMapper extends BaseMapper {
  /**
   * Specialized for General Song List.
   */
  static mapSongItem(raw: any): SongResponse {
    if (!raw) return {} as SongResponse;

    return {
      id: this.toNumber(raw.muzikID),
      isPlayable: this.toBool(raw.muzikcalinabilir),
      title: raw.muzikadi || '',
      artist: raw.muzik_sahipbilgi || '',
      streamUrl: raw.muziklink || '',
      imageUrl: this.toImageUrl(raw.music_image?.media_URL || raw.music_image?.media_minURL || raw.music_image?.media_bigURL) || '',
      listenCount: this.toNumber(raw.muzikdinlenmesay),
      isFavorite: this.toBool(raw.muzikfavoridurum)
    };
  }

  /**
   * Specialized for Search Song results.
   */
  static mapSearchSongItem(raw: any): SongResponse {
    if (!raw) return {} as SongResponse;

    return {
      id: this.toNumber(raw.muzikID),
      isPlayable: this.toBool(raw.muzikcalinabilir || 1), // Search results usually playable
      title: raw.muzikadi || '',
      artist: raw.muzik_sahipbilgi || '',
      streamUrl: raw.muzikbotlink || raw.muziklink || '',
      imageUrl: this.toImageUrl(raw.music_image?.media_URL || raw.music_image?.media_minURL || raw.music_image?.media_bigURL) || '',
      listenCount: this.toNumber(raw.muzikdinlenmesay),
      isFavorite: this.toBool(raw.muzikfavoridurum)
    };
  }

  /**
   * Maps a list from General Song List endpoint.
   */
  static mapSongList(rawList: any[]): SongResponse[] {
    return (rawList || []).map(item => this.mapSongItem(item));
  }

  /**
   * Maps a list from Search Song endpoint.
   */
  static mapSearchList(rawList: any[]): SongResponse[] {
    return (rawList || []).map(item => this.mapSearchSongItem(item));
  }

  /**
   * Specialized for Favorite Song results.
   */
  static mapFavoriteSongItem(raw: any): SongResponse {
    if (!raw) return {} as SongResponse;

    return {
      id: this.toNumber(raw.muzikID),
      isPlayable: this.toBool(raw.muzikcalinabilir || 1),
      title: raw.muzikadi || '',
      artist: raw.muzik_sahipbilgi || '',
      streamUrl: raw.muzikbotlink || raw.muziklink || '',
      imageUrl: this.toImageUrl(raw.music_image?.media_URL || raw.music_image?.media_minURL || raw.music_image?.media_bigURL) || '',
      listenCount: this.toNumber(raw.muzikdinlenmesay),
      isFavorite: true // By definition
    };
  }

  /**
   * Maps a list from Favorite Songs endpoint.
   */
  static mapFavoriteList(rawList: any[]): SongResponse[] {
    return (rawList || []).map(item => this.mapFavoriteSongItem(item));
  }

  /**
   * Specialized for Live Song results.
   */
  static mapLiveSongItem(raw: any): SongResponse {
    if (!raw) return {} as SongResponse;

    return {
      id: this.toNumber(raw.muzikID),
      isPlayable: this.toBool(raw.muzikcalinabilir || 1),
      title: raw.muzikadi || '',
      artist: raw.muzik_sahipbilgi || '',
      streamUrl: raw.muzikbotlink || raw.muziklink || '',
      imageUrl: this.toImageUrl(raw.music_image?.media_URL || raw.music_image?.media_minURL || raw.music_image?.media_bigURL) || '',
      listenCount: this.toNumber(raw.muzikdinlenmesay),
      isFavorite: this.toBool(raw.muzikfavoridurum)
    };
  }

  /**
   * Maps a list from Live Songs endpoint.
   */
  static mapLiveList(rawList: any[]): SongResponse[] {
    return (rawList || []).map(item => this.mapLiveSongItem(item));
  }
}
