/**
 * Raw data from API for Global Search.
 */
export interface GlobalSearchRawResponse {
  ID: number;
  Value: string;
  turu: string;
  username: string;
  avatar: string;
  cins: string;
  url?: string;
}

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
