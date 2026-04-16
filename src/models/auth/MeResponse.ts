import { User } from './User';

/**
 * Unique response interface for api.auth.me()
 */
export interface MeResponse {
  icerik: User | null;
  durum: number;
  aciklama: string;
}
