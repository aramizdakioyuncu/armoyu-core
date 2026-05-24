export interface ForumCategoryDTO {
  id: number;
  name: string;
  description?: string;
  topicCount?: number;
  postCount?: number;
  slug?: string;
}

export interface ForumTopicDTO {
  id: number;
  type?: string;
  title: string;
  url?: string;
  status?: number;
  date: string;
  content?: string;
  category?: { id: number; name: string; slug: string };
  creatorId: number;
  creatorName: string;
  creatorNicename?: string;
  creatorAvatar?: string;
  viewCount: number;
  replyCount: number;
  isLocked: boolean;
  isPinned: boolean;
}
