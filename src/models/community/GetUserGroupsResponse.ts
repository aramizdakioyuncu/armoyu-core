import { Group } from './Group';

export interface GetUserGroupsResponse {
  icerik: Group[];
  kod: number;
  durum: number;
  aciklama: string;
}
