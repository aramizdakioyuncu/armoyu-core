export class News {
  id?: string | number;
  title?: string;
  content?: string;
  summary?: string;
  image?: any;
  author?: any;
  publishedAt?: string;
  category?: string;
  views?: number;

  constructor(data?: Partial<News>) {
    Object.assign(this, data);
  }
}
