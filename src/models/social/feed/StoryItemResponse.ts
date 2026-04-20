export interface StoryItemResponse {
  id: number;
  status: number;
  ownerId: number;
  mediaUrl?: string;
  createdAt: string;
  isLiked: boolean;
  isViewed: boolean;
}
