export interface ChatMessageResponse {
  side: 'ben' | 'sen';
  authorName: string;
  authorAvatar: string;
  authorColor?: string;
  content: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  status: number;
}
