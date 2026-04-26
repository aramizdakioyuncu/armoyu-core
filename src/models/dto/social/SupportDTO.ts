export interface SupportTicketDTO {
  id: number;
  subject: string;
  status: string;
  category?: string;
  lastUpdate: string;
  createdAt: string;
  isClosed: boolean;
}

export interface SupportMessageDTO {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
}
