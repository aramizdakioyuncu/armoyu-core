import { SupportTicketDTO, SupportTicket } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Support Tickets.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class SupportMapper extends BaseMapper {
  static mapTicket(raw: any): SupportTicket {
    const legacy = this.shouldReturnRaw<SupportTicketDTO>(raw);
    if (legacy) return new SupportTicket(legacy);
    if (!raw) return new SupportTicket({} as SupportTicketDTO);

    return this.mapTicketV1(raw);
  }

  // --- VERSION 1 ---

  private static mapTicketV1(raw: any): SupportTicket {
    return new SupportTicket({
      id: this.toNumber(raw.destekID),
      subject: raw.baslik || '',
      status: raw.durum || '',
      category: raw.kategori,
      lastUpdate: raw.sonislemzaman || '',
      createdAt: raw.olusturmazaman || '',
      isClosed: this.toBool(raw.kapali)
    });
  }

  static mapTicketList(rawList: any[]): SupportTicket[] {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => this.mapTicket(item));
  }

  // --- VERSION 2 ---
  private static mapTicketV2(raw: any): SupportTicket {
    return this.mapTicketV1(raw);
  }
}
