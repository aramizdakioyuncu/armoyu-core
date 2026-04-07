import { User } from '../auth/User';
/**
 * Represents an entry in a leaderboard/ranking list.
 */
export declare class LeaderboardEntry {
    displayName: string;
    username: string;
    score: string;
    avatar: string;
    constructor(data: Partial<LeaderboardEntry>);
}
/**
 * Utility class to manage and generate various leaderboards across the platform.
 */
export declare class Leaderboard {
    /**
     * Generates a level-based ranking from a list of users.
     */
    static getLevelRankings(users: User[], limit?: number): LeaderboardEntry[];
    /**
     * Generates a popularity-based ranking from a list of users.
     */
    static getPopularityRankings(users: User[], limit?: number): LeaderboardEntry[];
}
