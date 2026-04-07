"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = exports.LeaderboardEntry = void 0;
/**
 * Represents an entry in a leaderboard/ranking list.
 */
class LeaderboardEntry {
    constructor(data) {
        this.displayName = '';
        this.username = '';
        this.score = '';
        this.avatar = '';
        Object.assign(this, data);
    }
}
exports.LeaderboardEntry = LeaderboardEntry;
/**
 * Utility class to manage and generate various leaderboards across the platform.
 */
class Leaderboard {
    /**
     * Generates a level-based ranking from a list of users.
     */
    static getLevelRankings(users, limit = 5) {
        return [...users]
            .sort((a, b) => (b.level || 0) - (a.level || 0) || (b.xp || 0) - (a.xp || 0))
            .slice(0, limit)
            .map(user => new LeaderboardEntry({
            displayName: user.displayName || user.username,
            username: user.username,
            score: `LVL ${user.level || 1}`,
            avatar: user.avatar
        }));
    }
    /**
     * Generates a popularity-based ranking from a list of users.
     */
    static getPopularityRankings(users, limit = 5) {
        return [...users]
            .sort((a, b) => (b.popScore || 0) - (a.popScore || 0))
            .slice(0, limit)
            .map(user => {
            const score = user.popScore || 0;
            const formattedScore = score >= 1000
                ? (score / 1000).toFixed(1) + 'k'
                : score.toString();
            return new LeaderboardEntry({
                displayName: user.displayName || user.username,
                username: user.username,
                score: formattedScore,
                avatar: user.avatar
            });
        });
    }
}
exports.Leaderboard = Leaderboard;
