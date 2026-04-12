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
export declare class Post {
    id: string;
    author: User | null;
    content: string;
    media: PostMedia[];
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    stats: PostStats;
    hashtags: string[];
    isPending: boolean;
    repostOf?: Post;
    likeList: User[];
    repostList: User[];
    commentList: PostComment[];
    constructor(data: Partial<Post>);
    /**
     * Instantiates a Post object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Post;
}
