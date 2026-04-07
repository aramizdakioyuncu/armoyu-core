import { Role } from './Role';
import { NotificationSender } from '../social/NotificationSender';
export interface CareerEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'JOIN' | 'RANK' | 'GROUP' | 'AWARD' | 'SYSTEM';
    icon?: string;
}
/**
 * Represents a User in the aramizdakioyuncu.com platform.
 */
export declare class User {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    banner: string;
    bio: string;
    role: Role | null;
    verified: boolean;
    level: number;
    xp: number;
    popScore: number;
    groups: any[];
    friends: User[];
    myPosts: any[];
    career: CareerEvent[];
    zodiac?: string;
    favoriteTeam?: any;
    punishmentCount: number;
    distrustScore: number;
    odp: number;
    constructor(data: Partial<User>);
    /**
     * Adds a new event to the user's career timeline.
     */
    addCareerEvent(event: Omit<CareerEvent, 'id'>): void;
    /**
     * Returns the absolute URL to the user's profile page.
     */
    getProfileUrl(): string;
    /**
     * Converts the user to a standardized notification sender.
     */
    toNotificationSender(): NotificationSender;
    /**
     * Instantiates a User object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): User;
}
