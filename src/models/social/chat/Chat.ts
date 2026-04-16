import { ChatMessage } from './Message';

export interface Chat {
  id?: string | number;
  participants?: any[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}



