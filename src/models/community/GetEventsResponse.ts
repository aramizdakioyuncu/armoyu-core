import { ArmoyuEvent } from './Event';

export interface GetEventsResponse {
  icerik: ArmoyuEvent[];
  durum: number;
  aciklama: string;
  kod: number;
}
