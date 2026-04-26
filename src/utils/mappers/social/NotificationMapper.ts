import { NotificationDTO, Notification } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for User Notifications.
 * Version-aware structure: Entry point delegates to specific version mappers.
 */
export class NotificationMapper extends BaseMapper {
  static mapNotification(raw: any, usePrevious: boolean = false): Notification {
    const legacy = this.shouldReturnRaw<NotificationDTO>(raw);
    if (legacy) return new Notification(legacy);
    if (!raw) return new Notification({} as NotificationDTO);

    return this.mapNotificationV1(raw);
  }

  // --- VERSION 1 ---

  private static mapNotificationV1(raw: any): Notification {
    return new Notification({
      id: this.toNumber(raw.bildirimID),
      type: raw.bildirimkategori,
      content: raw.bildirim_icerik || raw.bildirimmetin,
      date: raw.bildirimzaman,
      isRead: this.toBool(raw.bildirimokundu),
      sender: {
        id: this.toNumber(raw.bildirimgonderenid),
        displayName: raw.bildirimgonderenadsoyad,
        avatar: this.toImageUrl(raw.bildirimgonderenavatar) || ''
      }
    });
  }

  static mapNotificationList(rawList: any[], usePrevious: boolean = false): Notification[] {
    return (rawList || []).map(item => this.mapNotification(item, usePrevious));
  }

  // --- VERSION 2 ---
  private static mapNotificationV2(raw: any): Notification {
    return this.mapNotificationV1(raw);
  }
}
