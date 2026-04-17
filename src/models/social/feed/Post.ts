import { User } from '../../auth/User';

export interface Post {
  id?: string | number;
  postID?: string | number;
  post_id?: string | number;
  paylasimid?: string | number;
  paylasim_id?: string | number;

  content?: string;
  icerik?: string;
  text?: string;
  paylasimmetin?: string;
  paylasim_metin?: string;
  paylasimicerik?: string;
  paylasim_icerik?: string;
  sosyalicerik?: string;
  sosyal_icerik?: string;

  author?: User | null;
  oyuncu?: User | null;
  owner?: User | null;

  media?: string[] | any[];
  paylasimfoto?: any[];
  resim?: string;
  paylasimresim?: string;

  timestamp?: string;
  tarih?: string;
  created_at?: string;
  paylasimzaman?: string;
  paylasim_zaman?: string;
  zaman?: string;

  likeCount?: number | string;
  begeni_sayi?: number | string;
  begenisay?: number | string;

  commentCount?: number | string;
  yorum_sayi?: number | string;
  yorumsay?: number | string;

  isLiked?: boolean | number;
  begendi?: number;
  benbegendim?: number;

  comments?: any[];
}



