import { BaseResponse } from '../core/BaseResponse';
import { News } from '../entities/content/News';

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

export interface GetNewsResponse extends BaseResponse<News[]> {}
