/**
 * Unique response interface for api.social.getComments()
 */

export interface PostCommentDetail {
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

export interface GetCommentsResponse {
  icerik: PostCommentDetail[];
  kod: number;
  durum: number;
  aciklama: string;
}
