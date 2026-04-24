export interface StoryItemResponse {
  id: number;
  mediaUrl?: string;
  createdAt: string;
  isMe?: boolean;
  authorName?: string;
  authorAvatar?: string;
  status?: number;
  ownerId?: number;
}
