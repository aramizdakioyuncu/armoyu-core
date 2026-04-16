/**
 * Unique response interface for api.users.getXpRankings()
 */
export interface XpRankingUser {
  oyuncuID: number;
  oyuncuadsoyad: string;
  oyuncukullaniciadi: string;
  oyuncuavatar: string;
  oyuncuseviye: number;
  oyuncuseviyexp: string;
  oyuncuseviyesezonlukxp: string;
  oyuncupop: number;
}

export interface GetXpRankingsResponse {
  icerik: XpRankingUser[];
  kod: number;
  durum: number;
  aciklama: string;
}
