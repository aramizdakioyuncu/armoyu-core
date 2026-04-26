import { NewsDTO } from '../../dto/content/NewsDTO';

export class News implements NewsDTO {
  id: number;
  title: string;
  content?: string;
  summary?: string;
  thumbnail?: string;
  image?: string;
  author?: string;
  date?: string;
  timeAgo?: string;
  category?: string;
  views?: number;
  url?: string;

  constructor(data: NewsDTO) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.summary = data.summary;
    this.thumbnail = data.thumbnail;
    this.image = data.image;
    this.author = data.author;
    this.date = data.date;
    this.timeAgo = data.timeAgo;
    this.category = data.category;
    this.views = data.views;
    this.url = data.url;
  }

  /**
   * Returns a shareable URL for the news article.
   */
  get shareUrl(): string {
    return `https://aramizdakioyuncu.com/haber/${this.url || this.id}`;
  }

  /**
   * Returns a friendly view count (e.g., 1.2k).
   */
  get formattedViews(): string {
    if (!this.views) return '0';
    if (this.views >= 1000) {
      return (this.views / 1000).toFixed(1) + 'k';
    }
    return this.views.toString();
  }

  /**
   * Returns a reading time estimate based on content length.
   */
  get readingTime(): number {
    if (!this.content) return 1;
    const wordsPerMinute = 200;
    const words = this.content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Factory method to create a News from a DTO.
   */
  static fromJSON(data: NewsDTO): News {
    return new News(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): NewsDTO {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      summary: this.summary,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author,
      date: this.date,
      timeAgo: this.timeAgo,
      category: this.category,
      views: this.views,
      url: this.url
    };
  }
}
