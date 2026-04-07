"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const User_1 = require("../auth/User");
const NotificationSender_1 = require("../social/NotificationSender");
/**
 * Represents a Group (Grup) in the aramizdakioyuncu.com platform.
 */
class Group {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.shortName = '';
        this.slug = '';
        this.description = '';
        this.category = '';
        this.tag = '';
        this.banner = '';
        this.logo = '';
        this.recruitment = 'Açık';
        this.date = '';
        this.memberCount = 0;
        this.isPrivate = false;
        this.owner = null;
        this.moderators = [];
        this.members = [];
        this.permissions = [];
        Object.assign(this, data);
        if (!this.slug && this.name) {
            this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
    }
    /**
     * Returns the absolute URL to the group's page.
     */
    getGroupUrl() {
        return `/gruplar/${this.slug || this.name.toLowerCase().replace(/\s+/g, '-')}`;
    }
    /**
     * Converts the group to a standardized notification sender.
     */
    toNotificationSender() {
        return new NotificationSender_1.NotificationSender({
            id: this.id,
            name: this.name,
            avatar: this.logo,
            type: 'GROUP',
            url: this.getGroupUrl()
        });
    }
    /**
     * Instantiates a Group object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Group({
            id: json.id || '',
            name: json.name || '',
            shortName: json.shortName || json.name_short || '',
            slug: json.slug || '',
            description: json.description || '',
            category: json.category || '',
            tag: json.tag || '',
            banner: json.banner || json.banner_url || '',
            logo: json.logo || json.logo_url || '',
            recruitment: json.recruitment || 'Açık',
            date: json.date || json.created_at || '',
            memberCount: json.memberCount || json.member_count || 0,
            isPrivate: json.isPrivate || json.is_private || false,
            owner: json.owner ? User_1.User.fromJSON(json.owner) : null,
            moderators: Array.isArray(json.moderators) ? json.moderators.map((m) => User_1.User.fromJSON(m)) : [],
            members: Array.isArray(json.members) ? json.members.map((m) => User_1.User.fromJSON(m)) : [],
            permissions: Array.isArray(json.permissions) ? json.permissions : [],
        });
    }
}
exports.Group = Group;
