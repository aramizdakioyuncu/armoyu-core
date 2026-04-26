export interface NewsDTO {
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
}
