import { Group } from './Group';

export interface GetGroupsResponse {
  icerik: Group[];
  durum: number;
  aciklama: string;
  kod: number;
}
