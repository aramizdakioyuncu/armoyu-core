export interface StoryItemResponse {
  id: number;
  mediaUrl?: string;
  createdAt: string;
  isMe?: boolean;
  isSeen?: boolean;
  isLiked?: boolean;
  likeCount?: number;
  viewCount?: number;
  authorName?: string;
  authorAvatar?: string;
  status?: number;
  ownerId?: number;
}

export interface StoryUserResponse {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  date?: string;
}
