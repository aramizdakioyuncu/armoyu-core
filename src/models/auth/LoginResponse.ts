import { User } from './User';

/**
 * Unique response interface for api.auth.login()
 */
export interface LoginResponse {
  durum: number;
  aciklama: string;
  icerik: {
    user: User;
    token: string;
  } | null;
  kod?: number;
}
