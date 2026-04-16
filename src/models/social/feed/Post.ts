import { BaseModel } from '../../BaseModel';
import { User } from '../../auth/User';
import { Comment } from './Comment';

/**
 * Represents a Social Post.
 */
export class Post extends BaseModel {
  id: string = '';
  author: User | null = null;
  content: string = '';
  media: string[] = [];
  timestamp: string = '';
  likeCount: number = 0;
  commentCount: number = 0;
  isLiked: boolean = false;
  comments: Comment[] = [];

  constructor(data: Partial<Post>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Post object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Post {
    if (BaseModel.usePreviousApi) {
      return Post.legacyFromJSON(json);
    }
    return Post.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Post {
    return new Post({
      id: String(json.id || json.paylasimid || ''),
      author: json.author ? User.fromJSON(json.author) : (json.oyuncu ? User.fromJSON(json.oyuncu) : null),
      content: json.content || json.icerik || json.text || '',
      media: Array.isArray(json.media) ? json.media : (json.resim ? [json.resim] : []),
      timestamp: json.timestamp || json.tarih || json.created_at || '',
      likeCount: Number(json.likeCount || json.begeni_sayi || 0),
      commentCount: Number(json.commentCount || json.yorum_sayi || 0),
      isLiked: json.isLiked === true || json.begendi === 1 || false,
      comments: Array.isArray(json.comments) ? json.comments.map((c: any) => Comment.fromJSON(c)) : []
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Post {
    return new Post({});
  }
}
