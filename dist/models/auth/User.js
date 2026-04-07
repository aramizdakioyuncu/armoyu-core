"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Role_1 = require("./Role");
const NotificationSender_1 = require("../social/NotificationSender");
/**
 * Represents a User in the aramizdakioyuncu.com platform.
 */
class User {
    constructor(data) {
        this.id = '';
        this.username = '';
        this.displayName = '';
        this.avatar = '';
        this.banner = '';
        this.bio = '';
        this.role = null;
        this.verified = false;
        this.level = 1;
        this.xp = 0;
        this.popScore = 0;
        this.groups = [];
        this.friends = [];
        this.myPosts = [];
        this.career = [];
        this.punishmentCount = 0;
        this.distrustScore = 1.0; // Starts at 1.0 (Safe)
        this.odp = 50; // Player Rating Score (0-100)
        Object.assign(this, data);
        // Ensure numeric defaults
        this.punishmentCount = data.punishmentCount || 0;
        this.distrustScore = data.distrustScore || 1.0;
        this.odp = data.odp || 50;
    }
    /**
     * Adds a new event to the user's career timeline.
     */
    addCareerEvent(event) {
        const newEvent = {
            ...event,
            id: `CR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        };
        this.career = [newEvent, ...(this.career || [])];
    }
    /**
     * Returns the absolute URL to the user's profile page.
     */
    getProfileUrl() {
        return `/oyuncular/${this.username}`;
    }
    /**
     * Converts the user to a standardized notification sender.
     */
    toNotificationSender() {
        return new NotificationSender_1.NotificationSender({
            id: this.id,
            name: this.displayName,
            avatar: this.avatar,
            type: 'USER',
            url: this.getProfileUrl()
        });
    }
    /**
     * Instantiates a User object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new User({
            id: json.id || json.id_user || '',
            username: json.username || '',
            displayName: json.displayName || json.name || json.username || '',
            avatar: json.avatar || json.avatar_url || '',
            banner: json.banner || json.banner_url || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop',
            bio: json.bio || '',
            role: json.role ? Role_1.Role.fromJSON(json.role) : null,
            verified: json.verified || false,
            level: json.level || json.user_level || 1,
            xp: json.xp || json.experience || 0,
            popScore: json.popScore || 0,
            groups: json.groups || [],
            friends: Array.isArray(json.friends) ? json.friends.map((f) => {
                // Shallow conversion to avoid infinite recursion
                if (f instanceof User)
                    return f;
                return new User({
                    id: f.id || f.id_user || '',
                    username: f.username || '',
                    displayName: f.displayName || f.name || f.username || '',
                    avatar: f.avatar || f.avatar_url || '',
                    role: f.role ? Role_1.Role.fromJSON(f.role) : null,
                    verified: f.verified || false,
                    level: f.level || 1
                });
            }) : [],
        });
    }
}
exports.User = User;
