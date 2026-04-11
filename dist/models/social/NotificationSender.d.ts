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
