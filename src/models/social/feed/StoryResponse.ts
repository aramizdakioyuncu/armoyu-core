import { StoryItemResponse } from './StoryItemResponse';

export interface StoryResponse {
  authorId: number;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  storyCount: number;
  items: StoryItemResponse[];
  isSeen?: boolean;
}
