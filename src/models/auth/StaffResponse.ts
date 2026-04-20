export interface StaffResponse {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  social?: {
    facebook?: string;
    youtube?: string;
    twitch?: string;
    instagram?: string;
    steam?: string;
    linkedin?: string;
    reddit?: string;
    github?: string;
  };
  role?: {
    id: number;
    name: string;
    category: string;
    color: string;
  };
}
