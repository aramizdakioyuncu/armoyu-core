import { SupportTicketDTO } from '../../dto/social/SupportDTO';

export class SupportTicket implements SupportTicketDTO {
  id: number;
  subject: string;
  status: string;
  category?: string;
  lastUpdate: string;
  createdAt: string;
  isClosed: boolean;

  constructor(data: SupportTicketDTO) {
    this.id = data.id;
    this.subject = data.subject;
    this.status = data.status;
    this.category = data.category;
    this.lastUpdate = data.lastUpdate;
    this.createdAt = data.createdAt;
    this.isClosed = data.isClosed;
  }

  /**
   * Returns a friendly status label with colors (optional logic).
   */
  get statusLabel(): string {
    if (this.isClosed) return 'Kapatıldı';
    return this.status || 'Beklemede';
  }

  /**
   * Returns the ticket URL.
   */
  get ticketUrl(): string {
    return `/destek/talep/${this.id}`;
  }

  /**
   * Factory method to create a SupportTicket from a DTO.
   */
  static fromJSON(data: SupportTicketDTO): SupportTicket {
    return new SupportTicket(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): SupportTicketDTO {
    return {
      id: this.id,
      subject: this.subject,
      status: this.status,
      category: this.category,
      lastUpdate: this.lastUpdate,
      createdAt: this.createdAt,
      isClosed: this.isClosed
    };
  }
}
