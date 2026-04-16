/**
 * Unique response interface for api.blog.getNews() and getNewsLegacy()
 */

export interface NewsItem {
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

export interface GetNewsResponse {
  icerik: NewsItem[];
  durum: number;
  aciklama: string;
  kod: number;
}
