import { NotificationSender } from './NotificationSender';

export interface Notification {
  id?: string | number;
  type?: string;
  sender?: NotificationSender;
  content?: string;
  timestamp?: string;
  isRead?: boolean;
}



