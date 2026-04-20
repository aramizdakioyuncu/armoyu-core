export interface ChatResponse {
  id: number;
  username: string;
  displayName: string;
  lastMessage: string;
  lastLogin?: string;
  unreadCount: number;
  type: 'ozel' | 'grup';
  avatar: string;
}
