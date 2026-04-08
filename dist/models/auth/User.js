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
        const avatarData = json.avatar || {};
        const bannerData = json.banner || {};
        const detailInfo = json.detailInfo || {};
        const userRole = json.userRole || {};
        return new User({
            id: String(json.owner_ID || json.playerID || json.id || json.id_user || json.user_id || ''),
            username: json.username || json.user_name || json.owner_username || json.oyuncu_ad || '',
            displayName: json.displayname || json.owner_displayname || json.displayName || json.user_displayname || json.name || json.username || '',
            avatar: typeof avatarData === 'object' ? (avatarData.media_URL || avatarData.media_minURL || avatarData.media_bigURL || '') : avatarData,
            banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.media_minURL || '') : bannerData,
            bio: detailInfo.about || json.bio || json.oyuncu_bio || '',
            role: userRole.roleName ? Role_1.Role.fromJSON({ name: userRole.roleName, color: userRole.roleColor }) : (json.role ? Role_1.Role.fromJSON(json.role) : null),
            verified: json.verified || (json.oyuncu_onay === 1) || false,
            level: Number(json.level || json.oyuncu_seviye || 1),
            xp: Number(json.levelXP || json.xp || json.user_xp || 0),
            popScore: Number(json.popScore || json.user_popscore || 0),
            groups: json.groups || json.user_groups || [],
            friends: Array.isArray(json.friends) ? json.friends.map((f) => {
                if (f instanceof User)
                    return f;
                return User.fromJSON(f);
            }) : [],
        });
    }
}
exports.User = User;
