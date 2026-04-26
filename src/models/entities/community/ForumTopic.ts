import { ForumTopicDTO } from '../../dto/community/ForumDTO';

export class ForumTopic implements ForumTopicDTO {
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

  constructor(data: ForumTopicDTO) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.authorId = data.authorId;
    this.authorName = data.authorName;
    this.date = data.date;
    this.viewCount = data.viewCount;
    this.replyCount = data.replyCount;
    this.isLocked = data.isLocked;
    this.isPinned = data.isPinned;
  }

  /**
   * Returns the topic URL.
   */
  get topicUrl(): string {
    return `/forum/konu/${this.id}`;
  }

  /**
   * Returns true if the topic is popular (e.g., more than 100 views or 10 replies).
   */
  get isPopular(): boolean {
    return this.viewCount > 100 || this.replyCount > 10;
  }

  /**
   * Factory method to create a ForumTopic from a DTO.
   */
  static fromJSON(data: ForumTopicDTO): ForumTopic {
    return new ForumTopic(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ForumTopicDTO {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      authorId: this.authorId,
      authorName: this.authorName,
      date: this.date,
      viewCount: this.viewCount,
      replyCount: this.replyCount,
      isLocked: this.isLocked,
      isPinned: this.isPinned
    };
  }
}
