export type NotificationType = 'POST_LIKE' | 'POST_COMMENT' | 'POST_MENTION' | 'GROUP_INVITE' | 'GROUP_JOIN_REQUEST' | 'GROUP_ANNOUNCEMENT' | 'EVENT_INVITE' | 'EVENT_REMINDER' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT' | 'SYSTEM_ALERT' | 'SYSTEM_UPDATE';
export type NotificationCategory = 'SOCIAL' | 'GROUP' | 'EVENT' | 'SYSTEM';
export type SenderType = 'USER' | 'GROUP' | 'SYSTEM';
/**
 * Interface representing a standardized sender for notifications.
 */
export declare class NotificationSender {
    id: string;
    name: string;
    avatar: string;
    type: SenderType;
    url?: string;
    constructor(data: Partial<NotificationSender>);
    /**
     * Helper to create a system sender.
     */
    static system(): NotificationSender;
}
