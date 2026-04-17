import { User } from '../auth/User';

export interface GetXpRankingsResponse {
  icerik: User[];
  kod: number;
  durum: number;
  aciklama: string;
}
