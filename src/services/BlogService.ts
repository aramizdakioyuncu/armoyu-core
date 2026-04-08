import { News } from '../models/content/News';
import { BaseService } from './BaseService';

export class BlogService extends BaseService {
  /**
   * Get all news articles.
   */
  async getNews(page: number = 1, limit: number = 10): Promise<News[]> {
    try {
      const response = await this.client.get<{ news: any[] }>('/content/news', {
        params: { page, limit }
      });
      return response.news.map(n => News.fromJSON(n));
    } catch (error) {
      console.error('[BlogService] Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Get a single news article by slug.
   */
  async getNewsBySlug(slug: string): Promise<News | null> {
    try {
      const response = await this.client.get<any>(`/content/news/${slug}`);
      return News.fromJSON(response);
    } catch (error) {
      console.error(`[BlogService] Failed to fetch news article ${slug}:`, error);
      return null;
    }
  }

  /**
   * Search news articles.
   */
  async searchNews(query: string): Promise<News[]> {
    try {
      const response = await this.client.get<{ news: any[] }>('/content/news/search', {
        params: { q: query }
      });
      return response.news.map(n => News.fromJSON(n));
    } catch (error) {
      console.error('[BlogService] News search failed:', error);
      return [];
    }
  }
}
