export interface SongResponse {
  id: number;
  isPlayable: boolean;
  title: string;
  artist: string;
  streamUrl: string;
  imageUrl: string;
  listenCount: number;
  isFavorite: boolean;
}
