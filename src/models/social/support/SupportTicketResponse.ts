export interface SupportTicketResponse {
  id?: string | number;
  subject?: string;
  status?: string;
  category?: string;
  lastUpdate?: string;
  createdAt?: string;
  isClosed?: boolean;
}
