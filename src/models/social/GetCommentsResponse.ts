import { ArmoyuPostComment } from './GetPostsResponse';

export interface GetCommentsResponse {
  icerik: ArmoyuPostComment[];
  kod: number;
  durum: number;
  aciklama: string;
}
