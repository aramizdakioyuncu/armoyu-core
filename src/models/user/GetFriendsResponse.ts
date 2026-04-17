import { User } from '../auth/User';

export interface GetFriendsResponse {
  icerik: User[];
  durum: number;
  aciklama: string;
  kod: number;
}
