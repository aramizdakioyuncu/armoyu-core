import { ForumTopicDTO } from '../../dto/community/ForumDTO';

export class ForumTopic implements ForumTopicDTO {
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

  constructor(data: ForumTopicDTO) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title;
    this.url = data.url;
    this.status = data.status;
    this.date = data.date;
    this.content = data.content;
    this.category = data.category;
    this.creatorId = data.creatorId;
    this.creatorName = data.creatorName;
    this.creatorNicename = data.creatorNicename;
    this.creatorAvatar = data.creatorAvatar;
    this.viewCount = data.viewCount;
    this.replyCount = data.replyCount;
    this.isLocked = data.isLocked;
    this.isPinned = data.isPinned;
  }

  get isPopular(): boolean {
    return this.viewCount > 100 || this.replyCount > 10;
  }

  static fromJSON(data: ForumTopicDTO): ForumTopic {
    return new ForumTopic(data);
  }

  toJSON(): ForumTopicDTO {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      url: this.url,
      status: this.status,
      date: this.date,
      content: this.content,
      category: this.category,
      creatorId: this.creatorId,
      creatorName: this.creatorName,
      creatorNicename: this.creatorNicename,
      creatorAvatar: this.creatorAvatar,
      viewCount: this.viewCount,
      replyCount: this.replyCount,
      isLocked: this.isLocked,
      isPinned: this.isPinned
    };
  }
}
