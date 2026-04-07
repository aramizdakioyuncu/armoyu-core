"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a Group/Community/Guild in the aramizdakioyuncu.com platform.
 */
class Group {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.shortName = '';
        this.slug = '';
        this.description = '';
        this.avatar = ''; // Keep for backward compatibility
        this.logo = '';
        this.banner = '';
        this.coverImage = ''; // Keep for backward compatibility
        this.memberCount = 0;
        this.isPrivate = false;
        this.category = '';
        this.tag = '';
        this.recruitment = 'Açık';
        this.date = '';
        this.owner = null;
        this.moderators = [];
        this.members = [];
        this.permissions = [];
        Object.assign(this, data);
        if (!this.slug && this.name) {
            this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (!this.logo && this.avatar)
            this.logo = this.avatar;
        if (!this.banner && this.coverImage)
            this.banner = this.coverImage;
    }
    /**
     * Instantiates a Group object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new Group({
            id: json.id || '',
            name: json.name || '',
            shortName: json.shortName || json.tag || '',
            slug: json.slug || '',
            description: json.description || '',
            avatar: json.avatar || '',
            logo: json.logo || json.avatar || '',
            banner: json.banner || json.coverImage || json.cover_image || '',
            coverImage: json.coverImage || json.cover_image || '',
            memberCount: json.memberCount || json.member_count || 0,
            isPrivate: json.isPrivate || json.is_private || false,
            category: json.category || '',
            tag: json.tag || '',
            recruitment: json.recruitment || 'Açık',
            date: json.date || '',
            owner: json.owner ? User_1.User.fromJSON(json.owner) : null,
            moderators: Array.isArray(json.moderators) ? json.moderators.map((m) => User_1.User.fromJSON(m)) : [],
            members: Array.isArray(json.members) ? json.members.map((m) => User_1.User.fromJSON(m)) : [],
            permissions: Array.isArray(json.permissions) ? json.permissions : [],
        });
    }
}
exports.Group = Group;
