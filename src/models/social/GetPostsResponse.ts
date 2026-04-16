/**
 * Unique response interface for api.social.getPosts()
 */

export interface PostOwnerAvatar {
  media_bigURL: string;
  media_URL: string;
  media_minURL: string;
}

export interface PostOwner {
  owner_ID: number;
  owner_username: string;
  owner_displayname: string;
  owner_avatar: PostOwnerAvatar;
  job?: string;
  jobURL?: string;
}

export interface PostMedia {
  fotoID: number;
  owner: PostOwner;
  paylasimkategori: string;
  fotourl: string;
  fotoufakurl: string;
  fotominnakurl: string;
  medyayonu: string;
}

export interface PostLiker {
  begeni_ID: number;
  ID: number;
  adsoyad: string;
  kullaniciadi: string;
  avatar: string;
  URL: string;
  begeni_zaman: string;
}

export interface PostComment {
  paylasimID: number;
  yorumID: number;
  yorumcuid: number;
  yorumcuetiketad: string;
  yorumcukullaniciad: string;
  yorumcuadsoyad: string;
  yorumcuavatar: string;
  oyunculink: string;
  yorumcuufakavatar: string;
  yorumcuminnakavatar: string;
  yorumcuicerik: string;
  yorumcuzaman: string;
  yorumcuzamangecen: string;
  yorumcukimeyanit: number;
  yorumbegenisayi: number;
  yorumsikayetsayi: number;
  benbegendim: number;
  bensikayet: number;
}

export interface SocialPost {
  paylasimID: number;
  yayinliyanad: PostOwner;
  paylasimicerik: string;
  paylasimkonum: string;
  paylasimzaman: string;
  paylasimzamangecen: string;
  paylasimzamanedit: string | null;
  paylasimilkucbegenen: PostLiker[];
  begenisay: number;
  yorumsay: number;
  repostsay: number;
  sikayetsay: number;
  benbegendim: number;
  benyorumladim: number;
  benretweetledim: number;
  bensikayet: number;
  paylasimfoto: PostMedia[];
  ilkucyorum: PostComment[];
}

export interface GetPostsResponse {
  icerik: SocialPost[];
  kod: number;
  durum: number;
  aciklama: string;
}
