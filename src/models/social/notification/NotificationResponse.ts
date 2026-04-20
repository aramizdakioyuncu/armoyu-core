import { NotificationSenderResponse } from './NotificationSenderResponse';

export interface NotificationResponse {
  id?: string | number;
  type?: string;
  sender?: NotificationSenderResponse;
  content?: string;
  timestamp?: string;
  date?: string;
  isRead?: boolean;
}
