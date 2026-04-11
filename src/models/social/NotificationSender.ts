export type SenderType = 'USER' | 'GROUP' | 'SYSTEM';

/**
 * Interface representing a standardized sender for notifications.
 */
export class NotificationSender {
  id: string = '';
  name: string = '';
  avatar: string = '';
  type: SenderType = 'SYSTEM';
  url?: string;

  constructor(data: Partial<NotificationSender>) {
    Object.assign(this, data);
  }

  /**
   * Helper to create a system sender.
   */
  static system(): NotificationSender {
    return new NotificationSender({
      id: 'system',
      name: 'ARMOYU',
      avatar: 'https://armoyu.com/assets/img/armoyu_logo.png',
      type: 'SYSTEM'
    });
  }
}
