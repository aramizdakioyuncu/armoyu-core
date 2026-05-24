export interface ReelsResponse {
  id: number;
  owner: {
    id: number;
    displayName: string;
    username: string;
    avatar: string;
  };
  description: string;
  date: string;
  media: {
    id: number;
    url: string;
    high?: string;
    norm?: string;
    min?: string;
  };
  likeCount: number;
  commentCount: number;
  status: boolean | number;
}
