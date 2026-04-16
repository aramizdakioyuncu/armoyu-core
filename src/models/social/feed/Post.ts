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
      id: String(json.id || json.paylasimid || json.post_id || json.postID || json.paylasim_id || ''),
      author: json.author ? User.fromJSON(json.author) : (json.oyuncu ? User.fromJSON(json.oyuncu) : (json.owner ? User.fromJSON(json.owner) : (json.oyuncuID || json.oyuncu_ID || json.oyuncukullaniciadi ? User.fromJSON(json) : null))),
      content: json.content || json.icerik || json.text || json.paylasimmetin || json.paylasim_metin || json.paylasimicerik || json.paylasim_icerik || json.sosyalicerik || json.sosyal_icerik || json.owner?.paylasimicerik || json.oyuncu?.paylasim_icerik || '',
      media: Array.isArray(json.media) ? json.media : (Array.isArray(json.paylasimfoto) ? json.paylasimfoto.map((f: any) => f.fotourl || f.url) : (Array.isArray(json.owner?.paylasimfoto) ? json.owner.paylasimfoto.map((f: any) => f.fotourl || f.url) : (json.resim || json.paylasimresim || json.paylasim_resim ? [json.resim || json.paylasimresim || json.paylasim_resim] : []))),
      timestamp: json.timestamp || json.tarih || json.created_at || json.paylasimzaman || json.paylasim_zaman || json.zaman || json.owner?.paylasimzaman || json.oyuncu?.paylasim_zaman || '',
      likeCount: Number(json.likeCount || json.begeni_sayi || json.begenisay || 0),
      commentCount: Number(json.commentCount || json.yorum_sayi || json.yorumsay || 0),
      isLiked: json.isLiked === true || json.begendi === 1 || json.benbegendim === 1 || false,
      comments: Array.isArray(json.comments) ? json.comments.map((c: any) => Comment.fromJSON(c)) : []
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static v2FromJSON(json: Record<string, any>): Post {
    return Post.legacyFromJSON(json);
  }
}
