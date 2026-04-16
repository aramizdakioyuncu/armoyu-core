/**
 * Unique response interface for api.users.getUserMedia()
 */

export interface MediaItem {
  media_ID: number;
  media_ownerID: number;
  media_ownerusername: string;
  media_owneravatar: string;
  media_time: string;
  media_size: string;
  fotoID: number;
  fotosahipID: number;
  fotokategori: string;
  fotopaylas: string;
  fotozaman: string;
  fotodosyatipi: string;
  fotoorijinalurl: string;
  fotoufaklikurl: string;
  fotominnakurl: string;
}

export interface GetMediaResponse {
  icerik: MediaItem[];
  durum: number;
  aciklama: string;
  kod: number;
}
