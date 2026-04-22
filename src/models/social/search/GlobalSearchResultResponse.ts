export interface GlobalSearchResultResponse {
  id: number;
  type: 'oyuncu' | 'takim' | 'grup' | 'gruplar' | 'okul' | 'okullar' | string;
  title: string;
  displayName?: string;
  username?: string;
  gender?: 'E' | 'K' | string;
  image: string;
  url: string;
}
