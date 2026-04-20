/**
 * Data interface for api.auth.me() icerik
 */
export interface MeResponse {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  status?: string;
}
