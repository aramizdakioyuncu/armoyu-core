import { Group } from '../community/Group';
import { Post } from './Post';
import { NotificationSender } from './NotificationSender';
import { NotificationType, NotificationCategory } from './NotificationEnums';
/**
 * Represents a Notification in the aramizdakioyuncu.com platform.
 */
export declare class Notification {
    id: string;
    type: NotificationType;
    category: NotificationCategory;
    title: string;
    message: string;
    context: string;
    sender?: NotificationSender;
    link: string;
    isRead: boolean;
    isClickable: boolean;
    createdAt: string;
    postId?: string;
    commentId?: string;
    eventId?: string;
    groupId?: string;
    group?: Group;
    post?: Post;
    constructor(data: Partial<Notification>);
    /**
     * Instantiates a Notification object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Notification;
}
