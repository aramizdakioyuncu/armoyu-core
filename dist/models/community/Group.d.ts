import { User } from '../auth/User';
import { NotificationSender } from '../social/NotificationSender';
/**
 * Represents a Group (Grup) in the aramizdakioyuncu.com platform.
 */
export declare class Group {
    id: string;
    name: string;
    shortName: string;
    slug: string;
    description: string;
    category: string;
    tag: string;
    banner: string;
    logo: string;
    recruitment: string;
    date: string;
    memberCount: number;
    isPrivate: boolean;
    owner: User | null;
    moderators: User[];
    members: User[];
    permissions: string[];
    constructor(data: Partial<Group>);
    /**
     * Returns the absolute URL to the group's page.
     */
    getGroupUrl(): string;
    /**
     * Converts the group to a standardized notification sender.
     */
    toNotificationSender(): NotificationSender;
    /**
     * Instantiates a Group object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): Group;
}
