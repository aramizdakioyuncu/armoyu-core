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
        if (!json)
            return new Group({});
        // 1. Handle specialized metadata object structure (specific to some API endpoints)
        // Supports case variations: Group_URL, group_URL, grupURL, groupURL, etc.
        const urlMetadata = json.Group_URL || json.group_URL || json.grupURL || json.groupURL || {};
        const hasUrlMetadata = typeof urlMetadata === 'object' && Object.keys(urlMetadata).length > 0;
        // 2. Resolve Logo Sources
        // Supports: Group_logo, group_logo, grup_logo, etc.
        const logoField = json.Group_logo || json.group_logo || json.grup_logo || json.logo || json.logo_url || json.grup_minnakavatar || json.grup_avatar || json.avatar || json.media_logo || {};
        let logoData = logoField;
        if (hasUrlMetadata) {
            const metadataLogo = urlMetadata.Group_logo || urlMetadata.group_logo || urlMetadata.grup_logo || urlMetadata.logo;
            if (metadataLogo) {
                logoData = metadataLogo;
            }
        }
        // 3. Resolve Banner Sources
        const bannerField = json.Banner || json.banner || json.banner_url || json.grup_wallpaper || json.grup_vbanner || json.wallpaper || json.media_banner || json.group_banner || {};
        let bannerData = bannerField;
        if (hasUrlMetadata) {
            const metadataBanner = urlMetadata.Banner || urlMetadata.banner || urlMetadata.kapak || urlMetadata.cover;
            if (metadataBanner)
                bannerData = metadataBanner;
        }
        // 4. Resolve Slug
        let slug = json.slug || json.url || '';
        if (hasUrlMetadata) {
            slug = urlMetadata.url || urlMetadata.slug || slug;
            if (typeof urlMetadata === 'string' && !slug) {
                slug = urlMetadata;
            }
        }
        else if (typeof json.Group_URL === 'string') {
            slug = json.Group_URL;
        }
        else if (typeof json.group_URL === 'string') {
            slug = json.group_URL;
        }
        else if (typeof json.grupURL === 'string') {
            slug = json.grupURL;
        }
        // 5. Resolve Social Links
        const social = json.group_social || json.social || {};
        const website = json.website || social.group_website || social.website || '';
        const discord = json.discord || social.group_discord || social.discord || '';
        // 6. Handle Moderators and Members (Support all API variations)
        const rawModerators = json.moderators || json.yoneticiler || json.group_moderators || [];
        const rawMembers = json.members || json.uyeler || json.group_members || [];
        return new Group({
            id: String(json.id || json.grupID || json.grup_ID || json.group_ID || json.groupID || json.id_grup || ''),
            name: json.name || json.grupad || json.grup_ad || json.title || json.group_name || json.adi || '',
            shortName: json.shortName || json.name_short || json.grup_kisaad || json.tag || json.kisa_ad || json.group_shortname || '',
            slug: String(slug),
            description: json.description || json.grup_aciklama || json.aciklama || json.summary || json.group_description || '',
            category: json.category || json.grup_kategori || json.kategori || json.type || json.group_category || json.group_defaultgame || '',
            tag: json.tag || json.grup_etiket || json.label || json.group_categorydetail || '',
            logo: typeof logoData === 'object' ? (logoData.media_minURL || logoData.media_URL || logoData.media_bigURL || logoData.url || '') : logoData,
            banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.media_minURL || bannerData.url || '') : bannerData,
            recruitment: json.recruitment || json.alimdurum || json.group_recruitment || 'Açık',
            date: json.date || json.created_at || json.grup_kurulus || json.tarih || json.created || json.group_registered || '',
            memberCount: Number(json.memberCount || json.member_count || json.grupuyesayisi || json.uye_sayisi || json.group_membercount || 0),
            isPrivate: json.isPrivate || json.is_private || (json.group_joinstatus !== undefined ? (String(json.group_joinstatus) === '0') : false),
            owner: json.owner || json.group_owner ? User_1.User.fromJSON(json.owner || json.group_owner) : null,
            moderators: Array.isArray(rawModerators) ? rawModerators.map((m) => User_1.User.fromJSON(m)) : [],
            members: Array.isArray(rawMembers) ? rawMembers.map((m) => User_1.User.fromJSON(m)) : [],
            permissions: Array.isArray(json.permissions) ? json.permissions : [],
        });
    }
}
exports.Group = Group;
