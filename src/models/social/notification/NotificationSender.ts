import { BaseModel } from '../../BaseModel';

/**
 * Represents the entity that sent a notification.
 */
export class NotificationSender extends BaseModel {
  id: string = '';
  name: string = '';
  avatar: string = '';
  type: 'USER' | 'GROUP' | 'SYSTEM' = 'SYSTEM';
  url?: string;

  constructor(data: Partial<NotificationSender>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a NotificationSender object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): NotificationSender {
    if (BaseModel.usePreviousApi) {
      return NotificationSender.legacyFromJSON(json);
    }
    return NotificationSender.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): NotificationSender {
    return new NotificationSender({
      id: String(json.id || json.senderid || ''),
      name: json.name || json.displayname || json.ad || '',
      avatar: json.avatar || json.foto || '',
      type: json.type || 'SYSTEM',
      url: json.url || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): NotificationSender {
    return new NotificationSender({});
  }
}
