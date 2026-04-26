import { UserResponse } from './UserResponse';
import { CartItemResponse } from '../shop/CartItemResponse';
import { ConversationDTO } from '../dto/social/ChatDTO';
import { NotificationDTO } from '../dto/social/NotificationDTO';

export interface SessionResponse {
  user?: UserResponse | null;
  token?: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
  cart?: CartItemResponse[];
  myArticles?: any[];
  chatList?: ConversationDTO[];
  notifications?: NotificationDTO[];
}
