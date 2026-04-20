import { BaseResponse } from '../core/BaseResponse';
import { NewsResponse } from './NewsResponse';

export interface NewsItemResponse {
  haberID: number;
  haberbaslik: string;
  resim: string;
  resimminnak: string;
  resimorijinal: string;
  link: string;
  zaman: string;
  gecenzaman: string;
  yazar: string;
  yazarID: number;
  kategori: string;
  yazaravatar: string;
  goruntulen: number;
  ozet: string;
}

export interface GetNewsResponse extends BaseResponse<NewsResponse[]> {}
