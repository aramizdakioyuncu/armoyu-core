export interface SearchUserResponse {
  id: number;
  displayName: string;
  username?: string;
  avatar: string;
  type?: string;
  level?: number;
  points?: number;
  popularity?: number;
}
