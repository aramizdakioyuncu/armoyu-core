import { Role } from './Role';
import { NotificationSender } from '../social/NotificationSender';
import { Team } from '../community/Team';
import { UserBadge } from './UserBadge';
import { Game } from '../social/Game';
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
    favoriteTeam?: Team | null;
    punishmentCount: number;
    distrustScore: number;
    odp: number;
    createdAt: string;
    location: string;
    followerCount: number;
    followingCount: number;
    viewsCount: number;
    socials: Record<string, string>;
    firstName: string;
    lastName: string;
    isOnline: boolean;
    lastSeen: string;
    gender: string;
    birthday: string;
    email?: string;
    phoneNumber?: string;
    rankTitle: string;
    badges: UserBadge[];
    rating: number;
    memberNumber: string;
    levelColor: string;
    headerImage: string;
    age: number;
    inviteCode: string;
    lastLoginAt: string;
    registeredAt: string;
    country: string;
    city: string;
    jobTitle: string;
    defaultGroupId: string;
    friendCount: number;
    postCount: number;
    awardCount: number;
    mutualFriendsCount: number;
    gameCount: number;
    isFriend: boolean;
    isFollowing: boolean;
    friendStatusText: string;
    xpTarget: number;
    popularGames: Game[];
    mutualFriends: User[];
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
     * Returns the user's full name (combining firstName and lastName).
     */
    getFullName(): string;
    /**
     * Returns the user's name (displayName preferred, falls back to getFullName or username).
     */
    getName(): string;
    /**
     * Returns whether the user is currently online.
     */
    isUserOnline(): boolean;
    /**
     * Returns a percentage (0-100) of progress to the next level.
     */
    getXpProgress(): number;
    /**
     * Converts the user to a standardized notification sender.
     */
    toNotificationSender(): NotificationSender;
    /**
     * Instantiates a User object from a JSON object.
     */
    static fromJSON(json: Record<string, any>): User;
}
