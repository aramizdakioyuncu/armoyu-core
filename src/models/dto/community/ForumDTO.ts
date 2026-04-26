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
  title: string;
  content?: string;
  authorId: number;
  authorName: string;
  date: string;
  viewCount: number;
  replyCount: number;
  isLocked: boolean;
  isPinned: boolean;
}
