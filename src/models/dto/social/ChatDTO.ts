import { ChatType, MessageSide } from '../../social/meta/ChatEnums';

export interface ConversationDTO {
  id: number;
  username: string;
  displayName: string;
  lastMessage: string;
  lastLogin?: string;
  unreadCount: number;
  type: ChatType;
  avatar: string;
}

export interface MessageDTO {
  side: MessageSide;
  authorName: string;
  authorAvatar: string;
  authorColor?: string;
  content: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  status: number;
}
