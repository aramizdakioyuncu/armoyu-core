export interface ChatMessage {
  id?: string | number;
  chatId?: string | number;
  senderId?: string | number;
  content?: string;
  timestamp?: string;
  isRead?: boolean;
}



