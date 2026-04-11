import { User } from '../auth/User';
/**
 * Represents a News item (Haber) in the aramizdakioyuncu.com platform.
 */
export declare class News {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    relativeTime: string;
    category: string;
    image: string;
    thumbnail: string;
    fullImage: string;
    views: number;
    authorId: number;
    authorName: string;
    authorAvatar: string;
    author: User | null;
    constructor(data: Partial<News>);
    /**
     * Returns the absolute URL to the news article.
     */
    getUrl(): string;
    /**
     * Returns a truncated version of the content if excerpt is missing.
     */
    getSummary(length?: number): string;
    /**
     * Instantiates a News object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): News;
}
