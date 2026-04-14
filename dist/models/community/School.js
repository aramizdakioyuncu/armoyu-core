"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const User_1 = require("../auth/User");
const Faculty_1 = require("./Faculty");
const Classroom_1 = require("./Classroom");
const SchoolTeam_1 = require("./SchoolTeam");
/**
 * Represents a School (Okul/Üniversite) in the ARMOYU education ecosystem.
 */
class School {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.slug = '';
        this.logo = '';
        this.background = '';
        this.description = '';
        this.representative = null;
        this.faculties = [];
        this.teams = [];
        this.classrooms = [];
        this.joinPassword = '';
        this.isSocialFeedEnabled = true;
        this.memberCount = 0;
        Object.assign(this, data);
    }
    /**
     * Instantiates a School object from a JSON object.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        if (!json)
            return new School({});
        // Handle potential metadata objects (School_URL, etc.)
        const urlMetadata = json.School_URL || json.school_URL || json.okul_URL || json.okulURL || {};
        const hasUrlMetadata = typeof urlMetadata === 'object' && Object.keys(urlMetadata).length > 0;
        // Resolve Logo
        const logoField = json.School_logo || json.school_logo || json.okul_logo || json.avatar || {};
        let logoData = logoField;
        if (hasUrlMetadata) {
            const metadataLogo = urlMetadata.School_logo || urlMetadata.school_logo || urlMetadata.okul_logo || urlMetadata.logo;
            if (metadataLogo)
                logoData = metadataLogo;
        }
        // Resolve Background
        const bgData = json.Banner || json.banner || json.background || json.wallpaper || json.kapak || {};
        // Resolve Slug
        let slug = json.slug || json.url || '';
        if (hasUrlMetadata) {
            slug = urlMetadata.url || urlMetadata.slug || slug;
            if (typeof urlMetadata === 'string' && !slug)
                slug = urlMetadata;
        }
        return new School({
            id: String(json.id || json.okulID || ''),
            name: json.name || json.okul_ad || '',
            slug: String(slug),
            logo: typeof logoData === 'object' ? (logoData.media_minURL || logoData.media_URL || logoData.url || '') : logoData,
            background: typeof bgData === 'object' ? (bgData.media_URL || bgData.media_bigURL || bgData.url || '') : bgData,
            description: json.description || json.aciklama || '',
            representative: json.representative ? User_1.User.fromJSON(json.representative) : null,
            faculties: Array.isArray(json.faculties) ? json.faculties.map(Faculty_1.Faculty.fromJSON) : [],
            teams: Array.isArray(json.teams) ? json.teams.map(SchoolTeam_1.SchoolTeam.fromJSON) : [],
            classrooms: Array.isArray(json.classrooms) ? json.classrooms.map(Classroom_1.Classroom.fromJSON) : [],
            joinPassword: json.joinPassword || '',
            isSocialFeedEnabled: json.isSocialFeedEnabled !== undefined ? json.isSocialFeedEnabled : true,
            memberCount: Number(json.memberCount || json.uye_sayisi || 0)
        });
    }
}
exports.School = School;
