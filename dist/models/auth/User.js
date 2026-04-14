"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Role_1 = require("./Role");
const NotificationSender_1 = require("../social/NotificationSender");
const Team_1 = require("../community/Team");
const UserBadge_1 = require("./UserBadge");
const Game_1 = require("../social/Game");
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
        this.createdAt = '';
        this.location = '';
        // Stats
        this.followerCount = 0;
        this.followingCount = 0;
        this.viewsCount = 0;
        // Socials
        this.socials = {};
        // Additional Info
        this.firstName = '';
        this.lastName = '';
        this.isOnline = false;
        this.lastSeen = '';
        this.gender = '';
        this.birthday = '';
        this.rankTitle = '';
        this.badges = [];
        // Platform Metrics
        this.rating = 0; // ODP
        this.memberNumber = ''; // kulno
        this.levelColor = '';
        this.headerImage = ''; // wallpaper
        // Profile Stats
        this.age = 0;
        this.inviteCode = '';
        this.lastLoginAt = '';
        this.registeredAt = '';
        // Location & Job
        this.country = '';
        this.city = '';
        this.jobTitle = '';
        this.defaultGroupId = '';
        // Stats & Counts
        this.friendCount = 0;
        this.postCount = 0;
        this.awardCount = 0;
        this.mutualFriendsCount = 0;
        this.gameCount = 0;
        // Metadata
        this.isFriend = false;
        this.isFollowing = false;
        this.friendStatusText = '';
        // Leveling
        this.xpTarget = 1000;
        // Lists
        this.popularGames = [];
        this.mutualFriends = [];
        Object.assign(this, data);
        // Ensure numeric defaults
        this.punishmentCount = Number(data.punishmentCount || 0);
        this.distrustScore = Number(data.distrustScore || 1.0);
        this.odp = Number(data.odp || 50);
        this.level = Number(data.level || 1);
        this.xp = Number(data.xp || 0);
        this.xpTarget = Number(data.xpTarget || 1000);
        this.followerCount = Number(data.followerCount || 0);
        this.followingCount = Number(data.followingCount || 0);
        this.viewsCount = Number(data.viewsCount || 0);
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
     * Returns the user's full name (combining firstName and lastName).
     */
    getFullName() {
        if (this.firstName || this.lastName) {
            return `${this.firstName} ${this.lastName}`.trim();
        }
        return this.displayName || this.username;
    }
    /**
     * Returns the user's name (displayName preferred, falls back to getFullName or username).
     */
    getName() {
        return this.displayName || this.getFullName() || this.username;
    }
    /**
     * Returns whether the user is currently online.
     */
    isUserOnline() {
        return this.isOnline;
    }
    /**
     * Returns a percentage (0-100) of progress to the next level.
     */
    getXpProgress() {
        if (this.xpTarget <= 0)
            return 0;
        return Math.min(100, Math.max(0, (this.xp / this.xpTarget) * 100));
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!json)
            return new User({});
        const avatarData = json.avatar || json.oyuncu_avatar || json.oyuncuminnakavatar || {};
        const bannerData = json.banner || json.oyuncu_kapak || json.kapak || {};
        const wallpaperData = json.wallpaper || {};
        const detailInfo = json.detailInfo || json.oyuncu_bilgi || json.detail_info || {};
        const userRole = json.userRole || json.oyuncu_rutbe || {};
        const jobData = json.job || {};
        const countryData = detailInfo.country || {};
        const provinceData = detailInfo.province || {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const banHistory = json.banHistory || {};
        return new User({
            id: String(json.playerID || json.player_ID || json.id || json.owner_ID || json.id_user || json.user_id || json.oyuncuID || ''),
            username: json.username || json.player_userlogin || json.user_name || json.owner_username || json.oyuncu_ad || json.oyuncukullaniciad || json.oyuncukullaniciadi || '',
            displayName: json.displayname || json.player_displayname || json.owner_displayname || json.displayName || json.user_displayname || json.name || json.username || json.oyuncuad || '',
            firstName: json.firstName || '',
            lastName: json.lastName || '',
            avatar: typeof avatarData === 'object' ? (avatarData.media_URL || avatarData.media_minURL || avatarData.media_bigURL || json.player_avatar || '') : (avatarData || json.player_avatar || ''),
            banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.media_minURL || '') : bannerData,
            headerImage: typeof wallpaperData === 'object' ? (wallpaperData.media_URL || wallpaperData.media_bigURL || '') : wallpaperData,
            bio: detailInfo.about || detailInfo.aciklama || json.bio || json.oyuncu_bio || json.aciklama || json.description || '',
            role: userRole.roleName ? Role_1.Role.fromJSON({ name: userRole.roleName, color: userRole.roleColor }) : (json.role ? Role_1.Role.fromJSON(json.role) : null),
            verified: json.verified === true || json.oyuncu_onay === 1 || json.oyuncu_onay === '1' || false,
            level: Number(json.level || json.oyuncu_seviye || 1),
            levelColor: json.levelColor || '',
            xp: Number(json.levelXP || json.xp || json.user_xp || 0),
            xpTarget: Number(json.nextLevelXP || json.xpTarget || json.seviye_xp_hedef || 1000),
            popScore: Number(json.popScore || json.user_popscore || 0),
            rating: Number(json.ODP || json.rating || 0),
            memberNumber: String(json.kulno || json.memberNumber || ''),
            age: Number(detailInfo.age || 0),
            inviteCode: detailInfo.inviteCode || '',
            lastLoginAt: detailInfo.lastloginDate || '',
            registeredAt: json.registeredAt || json.registeredDate || json.created_at || '',
            country: countryData.country_name || '',
            city: provinceData.province_name || detailInfo.location || json.location || json.sehir || '',
            jobTitle: jobData.job_name || '',
            defaultGroupId: String(((_a = json.defaultGroup) === null || _a === void 0 ? void 0 : _a.group_ID) || ''),
            groups: json.groups || json.user_groups || [],
            friendCount: Number(detailInfo.friends || 0),
            postCount: Number(detailInfo.posts || 0),
            awardCount: Number(detailInfo.awards || 0),
            mutualFriendsCount: Number(json.ortakarkadaslar || 0),
            gameCount: Number(json.mevcutoyunsayisi || 0),
            friends: Array.isArray(json.friends || json.arkadasliste) ? (json.friends || json.arkadasliste).map((f) => {
                if (f instanceof User)
                    return f;
                // Handle simpler list objects from API
                const friendJson = {
                    playerID: f.playerID || f.oyuncuID,
                    username: f.username || f.oyuncukullaniciadi,
                    avatar: { media_URL: f.avatar || f.oyuncuminnakavatar }
                };
                return User.fromJSON(friendJson);
            }) : [],
            mutualFriends: Array.isArray(json.ortakarkadasliste) ? json.ortakarkadasliste.map((f) => {
                const friendJson = {
                    playerID: f.oyuncuID,
                    username: f.oyuncukullaniciadi,
                    avatar: { media_URL: f.oyuncuminnakavatar }
                };
                return User.fromJSON(friendJson);
            }) : [],
            followerCount: Number(json.followerCount || json.follower_count || json.oyuncu_takipci || 0),
            followingCount: Number(json.followingCount || json.following_count || json.oyuncu_takip_edilen || 0),
            viewsCount: Number(json.viewsCount || json.views_count || json.oyuncu_goruntulenme || 0),
            zodiac: json.zodiac || json.burc || detailInfo.zodiac || '',
            favoriteTeam: (json.favoriteTeam || json.favorite_team || json.favori_takim || detailInfo.favorite_team || json.favTeam) ? Team_1.Team.fromJSON(json.favoriteTeam || json.favorite_team || json.favori_takim || detailInfo.favorite_team || json.favTeam) : null,
            createdAt: json.createdAt || json.created_at || json.kayit_tarihi || detailInfo.created_at || '',
            location: detailInfo.location || json.location || json.sehir || detailInfo.city || detailInfo.sehir || '',
            isOnline: json.isOnline === true || json.is_online === 1 || json.oyuncu_online === 1 || false,
            lastSeen: json.lastSeen || json.last_login || json.son_gorulme || detailInfo.last_login || '',
            gender: json.gender || json.cinsiyet || detailInfo.gender || detailInfo.cinsiyet || '',
            birthday: json.birthday || json.dogum_tarihi || detailInfo.birthday || detailInfo.dogum_tarihi || detailInfo.birthdayDate || '',
            email: json.email || json.user_email || detailInfo.email || '',
            phoneNumber: json.phoneNumber || json.phone || json.telefon || detailInfo.phoneNumber || '',
            rankTitle: json.rankTitle || json.rank_name || json.rutbe_ad || userRole.roleName || '',
            isFriend: json.isFriend === true || json.is_friend === 1 || Number(json.arkadasdurum) === 1 || false,
            isFollowing: json.isFollowing === true || json.is_following === 1 || false,
            friendStatusText: json.arkadasdurumaciklama || '',
            badges: Array.isArray(json.badges || json.rozetler) ? (json.badges || json.rozetler).map((b) => (0, UserBadge_1.mapBadgeFromJSON)(b)) : [],
            popularGames: Array.isArray(json.popularGames) ? json.popularGames.map((g) => Game_1.Game.fromJSON(g)) : [],
            socials: {
                discord: detailInfo.discord || json.discord || '',
                steam: detailInfo.steam || json.steam || jobData.steam || ((_b = json.socailAccounts) === null || _b === void 0 ? void 0 : _b.steam) || '',
                instagram: detailInfo.instagram || json.instagram || ((_c = json.socailAccounts) === null || _c === void 0 ? void 0 : _c.instagram) || '',
                twitter: detailInfo.twitter || json.twitter || ((_d = json.socailAccounts) === null || _d === void 0 ? void 0 : _d.twitter) || '',
                facebook: detailInfo.facebook || json.facebook || ((_e = json.socailAccounts) === null || _e === void 0 ? void 0 : _e.facebook) || '',
                linkedin: detailInfo.linkedin || json.linkedin || ((_f = json.socailAccounts) === null || _f === void 0 ? void 0 : _f.linkedin) || '',
                youtube: ((_g = json.socailAccounts) === null || _g === void 0 ? void 0 : _g.youtube) || '',
                twitch: ((_h = json.socailAccounts) === null || _h === void 0 ? void 0 : _h.twitch) || '',
                github: ((_j = json.socailAccounts) === null || _j === void 0 ? void 0 : _j.github) || '',
                ...(json.socials || json.social_media || detailInfo.socials || {})
            }
        });
    }
}
exports.User = User;
