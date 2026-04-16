import { BaseModel } from '../../BaseModel';

/**
 * Represents a Support Ticket.
 */
export class SupportTicket extends BaseModel {
  id: string = '';
  subject: string = '';
  category: string = '';
  status: string = '';
  priority: string = '';
  createdAt: string = '';
  updatedAt: string = '';

  constructor(data: Partial<SupportTicket>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a Support Ticket object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): SupportTicket {
    if (BaseModel.usePreviousApi) {
      return SupportTicket.legacyFromJSON(json);
    }
    return SupportTicket.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): SupportTicket {
    return new SupportTicket({
      id: String(json.id || json.destekid || ''),
      subject: json.subject || json.baslik || '',
      category: json.category || json.kategori || '',
      status: json.status || json.durum || '',
      priority: json.priority || json.oncelik || '',
      createdAt: json.createdAt || json.tarih || '',
      updatedAt: json.updatedAt || json.guncelleme || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): SupportTicket {
    return new SupportTicket({});
  }
}
