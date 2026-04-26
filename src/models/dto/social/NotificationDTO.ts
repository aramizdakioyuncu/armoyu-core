export interface NotificationSenderDTO {
  id: number;
  displayName: string;
  avatar: string;
}

export interface NotificationDTO {
  id: number;
  type: string;
  sender: NotificationSenderDTO;
  content: string;
  date: string;
  isRead: boolean;
}
