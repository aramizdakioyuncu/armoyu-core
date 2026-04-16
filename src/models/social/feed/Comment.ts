import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';

/**
 * Represents a Comment on a Post.
 */
export class Comment extends BaseModel {
  id: string = '';
  author: User | null = null;
  content: string = '';
  timestamp: string = '';
  likeCount: number = 0;
  isLiked: boolean = false;
  replies: Comment[] = [];

  constructor(data: Partial<Comment>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Comment object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Comment {
    if (BaseModel.usePreviousApi) {
      return Comment.legacyFromJSON(json);
    }
    return Comment.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Comment {
    return new Comment({
      id: String(json.id || json.yorumid || ''),
      author: json.author ? User.fromJSON(json.author) : (json.oyuncu ? User.fromJSON(json.oyuncu) : null),
      content: json.content || json.icerik || json.comment || '',
      timestamp: json.timestamp || json.tarih || json.created_at || '',
      likeCount: Number(json.likeCount || json.begeni_sayi || 0),
      isLiked: json.isLiked === true || json.begendi === 1 || false,
      replies: Array.isArray(json.replies) ? json.replies.map((r: any) => Comment.fromJSON(r)) : []
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Comment {
    return new Comment({});
  }
}
