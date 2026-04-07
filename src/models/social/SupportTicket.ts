import { User } from '../auth/User';

/**
 * Represents a Support Ticket in the armoyu platform.
 */
export class SupportTicket {
  id: string = '';
  subject: string = '';
  category: string = 'Genel'; // Şikayet, Öneri, Bildiri
  status: string = 'Açık'; // Açık, Cevaplandı, Kapandı
  priority: string = 'Normal'; // Düşük, Normal, Yüksek
  createdAt: string = '';
  updatedAt: string = '';
  lastMessage: string = '';
  author?: User;

  constructor(data: Partial<SupportTicket>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a SupportTicket object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): SupportTicket {
    return new SupportTicket({
      id: json.id || '',
      subject: json.subject || '',
      category: json.category || 'Genel',
      status: json.status || 'Açık',
      priority: json.priority || 'Normal',
      createdAt: json.createdAt || json.created_at || '',
      updatedAt: json.updatedAt || json.updated_at || '',
      lastMessage: json.lastMessage || json.last_message || '',
      author: json.author ? User.fromJSON(json.author) : undefined,
    });
  }
}
