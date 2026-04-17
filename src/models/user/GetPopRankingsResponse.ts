import { User } from '../auth/User';

export interface GetPopRankingsResponse {
  icerik: User[];
  kod: number;
  durum: number;
  aciklama: string;
}
