import { User } from '../auth/User';

export interface PostMedia {
  type: 'image' | 'video';
  url: string;
}

export interface PostStats {
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
}

export interface PostComment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes?: number;
  replies?: PostComment[];
}

/**
 * Represents a Post (Gönderi/Paylaşım) in the aramizdakioyuncu.com platform.
 */
export class Post {
  id: string = '';
  author: User | null = null;
  content: string = '';
  media: PostMedia[] = [];
  createdAt: string = '';
  likesCount: number = 0;
  commentsCount: number = 0;
  stats: PostStats = { likes: 0, comments: 0, reposts: 0, shares: 0 };
  hashtags: string[] = [];
  isPending: boolean = false;
  repostOf?: Post; // Original post if this is a repost

  // Real-time Lists
  likeList: User[] = [];
  repostList: User[] = [];
  commentList: PostComment[] = [];

  constructor(data: Partial<Post>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Post object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Post {
    const likes = Number(json.begenisay || 0);
    const comments = Number(json.yorumsay || 0);
    const reposts = Number(json.repostsay || 0);
    const shares = Number(json.sikayetsay || 0);

    return new Post({
      id: String(json.postID || json.id || json.post_ID || json.paylasimID || json.paylasim_ID || ''),
      author: (json.owner || json.author) ? User.fromJSON(json.owner || json.author) : null,
      content: json.paylasimicerik || json.content || json.post_content || '',
      media: Array.isArray(json.paylasimfoto) ? json.paylasimfoto.map((f: any) => ({ type: 'image', url: f.fotourl || f.fotoufakurl || f.foto_URL })) : (Array.isArray(json.media) ? json.media : []),
      createdAt: json.paylasimzaman || json.createdAt || json.created_at || json.post_date || '',
      likesCount: likes,
      commentsCount: comments,
      stats: {
        likes,
        comments,
        reposts,
        shares,
      },
      hashtags: json.hashtags || [],
      likeList: Array.isArray(json.paylasimilkucbegenen) ? json.paylasimilkucbegenen.map(User.fromJSON) : (Array.isArray(json.likeList) ? json.likeList.map(User.fromJSON) : []),
      commentList: Array.isArray(json.ilkucyorum) ? json.ilkucyorum.map((c: any) => ({
        ...c,
        author: User.fromJSON(c),
        content: c.yorumcuicerik,
        createdAt: c.yorumcuzaman
      })) : [],
      repostOf: json.repostOf ? Post.fromJSON(json.repostOf) : undefined
    });
  }
}
