import { User } from '../auth/User';

/**
 * Represents a News item (Haber) in the aramizdakioyuncu.com platform.
 */
export class News {
  id: number = 0;
  slug: string = '';
  title: string = '';
  excerpt: string = '';
  content: string = '';
  date: string = '';
  relativeTime: string = '';
  category: string = '';
  image: string = '';
  thumbnail: string = '';
  fullImage: string = '';
  views: number = 0;
  
  // Author details
  authorId: number = 0;
  authorName: string = '';
  authorAvatar: string = '';
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
   * Returns a truncated version of the content if excerpt is missing.
   */
  getSummary(length: number = 150): string {
    if (this.excerpt) return this.excerpt;
    if (!this.content) return '';
    return this.content.substring(0, length) + (this.content.length > length ? '...' : '');
  }

  /**
   * Instantiates a News object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): News {
    // Robustly handle slug from a full URL if needed
    let slug = json.slug || '';
    if (!slug && json.link) {
      const parts = json.link.split('/');
      slug = parts[parts.length - 1];
    }

    return new News({
      id: Number(json.haberID || json.id || 0),
      slug: slug,
      title: json.haberbaslik || json.title || '',
      excerpt: json.ozet || json.excerpt || json.summary || '',
      content: json.icerik || json.content || '',
      date: json.zaman || json.date || '',
      relativeTime: json.gecenzaman || json.relativeTime || '',
      category: json.kategori || json.category || '',
      image: json.resim || json.image || '',
      thumbnail: json.resimminnak || json.thumbnail || '',
      fullImage: json.resimorijinal || json.fullImage || '',
      views: Number(json.goruntulen || json.views || 0),
      authorId: Number(json.yazarID || json.authorId || 0),
      authorName: json.yazar || json.authorName || '',
      authorAvatar: json.yazaravatar || json.authorAvatar || '',
      author: json.author ? (json.author instanceof User ? json.author : User.fromJSON(json.author)) : (json.yazar ? new User({ id: String(json.yazarID), displayName: json.yazar, avatar: json.yazaravatar }) : null),
    });
  }
}
