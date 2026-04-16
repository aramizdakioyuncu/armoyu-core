/**
 * Unique response interface for api.users.getFriendsList()
 */

export interface FriendItem {
  oyuncuID: number;
  oyuncuavatar: string;
  oyuncuadsoyad: string;
  oyuncuad: string;
  oyuncukullaniciad: string;
  oyunculevel: number;
  oyuncudurum: number;
  songiris: string;
  oyuncuarkadasdurum: number;
}

export interface GetFriendsResponse {
  icerik: FriendItem[];
  durum: number;
  aciklama: string;
  kod: number;
}
