export interface GlobalSearchResultResponse {
  id: number;
  type: 'oyuncu' | 'takim' | 'grup' | string;
  title: string;
  image: string;
  url: string;
}
