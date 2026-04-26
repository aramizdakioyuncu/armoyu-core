export interface ConversationDTO {
  id: number;
  username: string;
  displayName: string;
  lastMessage: string;
  lastLogin?: string;
  unreadCount: number;
  type: 'ozel' | 'grup';
  avatar: string;
}

export interface MessageDTO {
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
