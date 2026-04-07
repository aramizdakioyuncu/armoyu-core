import { User } from '../auth/User';
/**
 * Represents a News item (Haber) in the aramizdakioyuncu.com platform.
 */
export declare class News {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    image: string;
    author: User | null;
    constructor(data: Partial<News>);
    /**
     * Returns the absolute URL to the news article.
     */
    getUrl(): string;
    /**
     * Instantiates a News object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): News;
}
