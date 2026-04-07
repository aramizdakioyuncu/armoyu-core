import { User } from '../auth/User';

/**
 * Represents a Comment (Yorum) in the aramizdakioyuncu.com platform.
 */
export class Comment {
  id: string = '';
  author: User | null = null;
  text: string = '';
  date: string = '';
  replies: Comment[] = [];

  constructor(data: Partial<Comment>) {
    Object.assign(this, data);
  }

  /**
   * Adds a reply to the comment.
   */
  addReply(reply: Comment): void {
    this.replies.push(reply);
  }

  /**
   * Instantiates a Comment object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Comment {
    return new Comment({
      id: json.id || '',
      author: json.user ? User.fromJSON(json.user) : (json.author_name ? new User({ displayName: json.author_name }) : null),
      text: json.text || json.comment || '',
      date: json.date || json.created_at || '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replies: Array.isArray(json.replies) ? json.replies.map((r: any) => Comment.fromJSON(r)) : [],
    });
  }
}
