/**
 * Response model for a Reels item.
 */
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
  };
  likeCount: number;
  commentCount: number;
  status: number;
}
