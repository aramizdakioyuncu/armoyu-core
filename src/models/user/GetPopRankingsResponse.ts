/**
 * Unique response interface for api.users.getPopRankings()
 */
export interface PopRankingUser {
  oyuncuID: number;
  oyuncuadsoyad: string;
  oyuncukullaniciadi: string;
  oyuncuavatar: string;
  oyuncuseviye: number;
  oyuncuseviyexp: string;
  oyuncuseviyesezonlukxp: string;
  oyuncupop: number;
}

export interface GetPopRankingsResponse {
  icerik: PopRankingUser[];
  kod: number;
  durum: number;
  aciklama: string;
}
