import { User } from './User';
import { CartItem } from '../shop/CartItem';
import { Chat } from '../social/chat/Chat';
import { Notification } from '../social/notification/Notification';

export interface Session {
  user?: User | null;
  token?: string | null;
  refreshToken?: string | null;
  expiresAt?: number | null;
  cart?: CartItem[];
  myArticles?: any[];
  chatList?: Chat[];
  notifications?: Notification[];
}



