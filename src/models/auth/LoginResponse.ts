import { UserResponse } from './UserResponse';

/**
 * Unique data interface for api.auth.login() icerik
 */
export interface LoginResponse {
  user: UserResponse;
  token: string;
  session?: {
    id: number;
    ip: string;
    device: string;
    date: string;
  };
}
