import { UserResponse } from './UserResponse';
import { CartItemResponse } from '../shop/CartItemResponse';
import { ChatResponse } from '../social/chat/ChatResponse';
import { NotificationResponse } from '../social/notification/NotificationResponse';

export interface SessionResponse {
  user?: UserResponse | null;
  token?: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
  cart?: CartItemResponse[];
  myArticles?: any[];
  chatList?: ChatResponse[];
  notifications?: NotificationResponse[];
}
