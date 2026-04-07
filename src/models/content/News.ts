import { User } from '../auth/User';

/**
 * Represents a News item (Haber) in the aramizdakioyuncu.com platform.
 */
export class News {
  slug: string = '';
  title: string = '';
  excerpt: string = '';
  content: string = '';
  date: string = '';
  category: string = '';
  image: string = '';
  author: User | null = null;

  constructor(data: Partial<News>) {
    Object.assign(this, data);
  }

  /**
   * Returns the absolute URL to the news article.
   */
  getUrl(): string {
    return `/haberler/${this.slug}`;
  }

  /**
   * Instantiates a News object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): News {
    return new News({
      slug: json.slug || '',
      title: json.title || '',
      excerpt: json.excerpt || json.summary || '',
      content: json.content || '',
      date: json.date || '',
      category: json.category || '',
      image: json.image || '',
      author: json.author ? (json.author instanceof User ? json.author : User.fromJSON(json.author)) : (json.authorUsername ? new User({ username: json.authorUsername, displayName: json.authorName }) : null),
    });
  }
}
