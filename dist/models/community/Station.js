"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station = exports.StationCoupon = exports.WorkstationEquipment = exports.StationProduct = void 0;
const User_1 = require("../auth/User");
/**
 * Represents a menu item or a product in a station.
 */
class StationProduct {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.price = 0;
        this.category = '';
        Object.assign(this, data);
    }
    static fromJSON(json) {
        return new StationProduct({
            id: json.id || '',
            name: json.name || '',
            price: json.price || 0,
            category: json.category || '',
            image: json.image,
            isDeal: json.isDeal,
            discountRate: json.discountRate,
        });
    }
}
exports.StationProduct = StationProduct;
/**
 * Represents detailed hardware/equipment in a workstation setup.
 */
class WorkstationEquipment {
    constructor(data) {
        this.id = '';
        this.name = 'Standart Masa'; // e.g., "VIP Oda #1"
        this.cpu = '';
        this.gpu = '';
        this.ram = '';
        this.monitor = '';
        this.keyboard = '';
        this.mouse = '';
        this.isAvailable = true;
        Object.assign(this, data);
    }
    static fromJSON(json) {
        var _a;
        return new WorkstationEquipment({
            id: json.id || '',
            name: json.name || '',
            cpu: json.cpu || '',
            gpu: json.gpu || '',
            ram: json.ram || '',
            monitor: json.monitor || '',
            keyboard: json.keyboard || '',
            mouse: json.mouse || '',
            isAvailable: (_a = json.isAvailable) !== null && _a !== void 0 ? _a : true,
        });
    }
}
exports.WorkstationEquipment = WorkstationEquipment;
class StationCoupon {
    constructor(data) {
        this.code = '';
        this.discount = '';
        this.expiryDate = '';
        this.description = '';
        Object.assign(this, data);
    }
    static fromJSON(json) {
        return new StationCoupon({
            code: json.code || '',
            discount: json.discount || '',
            expiryDate: json.expiryDate || '',
            description: json.description || '',
        });
    }
}
exports.StationCoupon = StationCoupon;
/**
 * Represents a Station (İstasyon) in the aramizdakioyuncu.com platform.
 */
class Station {
    constructor(data) {
        this.id = '';
        this.name = '';
        this.slug = '';
        this.type = 'YEMEK';
        this.description = '';
        this.location = '';
        this.logo = '';
        this.banner = '';
        this.rating = 0;
        this.reviewCount = 0;
        this.owner = null;
        // Refactored to unified classes
        this.products = [];
        this.equipment = [];
        this.pricing = [];
        this.coupons = [];
        this.facilities = [];
        Object.assign(this, data);
        if (!this.slug && this.name) {
            this.slug = this.name.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
        }
    }
    static fromJSON(json) {
        if (!json)
            return new Station({});
        // Handle potential metadata objects (Station_URL, etc.)
        const urlMetadata = json.Station_URL || json.station_URL || json.durak_URL || json.durakURL || {};
        const hasUrlMetadata = typeof urlMetadata === 'object' && Object.keys(urlMetadata).length > 0;
        // Resolve Logo
        const logoField = json.Station_logo || json.station_logo || json.durak_logo || json.avatar || {};
        let logoData = logoField;
        if (hasUrlMetadata) {
            const metadataLogo = urlMetadata.Station_logo || urlMetadata.station_logo || urlMetadata.durak_logo || urlMetadata.logo;
            if (metadataLogo)
                logoData = metadataLogo;
        }
        // Resolve Banner
        const bannerData = json.Banner || json.banner || json.durak_kapak || json.wallpaper || {};
        // Resolve Slug
        let slug = json.slug || json.url || '';
        if (hasUrlMetadata) {
            slug = urlMetadata.url || urlMetadata.slug || slug;
            if (typeof urlMetadata === 'string' && !slug)
                slug = urlMetadata;
        }
        return new Station({
            id: String(json.id || json.durakID || ''),
            name: json.name || json.durak_ad || '',
            slug: String(slug),
            type: json.type || 'YEMEK',
            description: json.description || json.aciklama || '',
            location: json.location || json.adres || '',
            logo: typeof logoData === 'object' ? (logoData.media_minURL || logoData.media_URL || logoData.url || '') : logoData,
            banner: typeof bannerData === 'object' ? (bannerData.media_URL || bannerData.media_bigURL || bannerData.url || '') : bannerData,
            rating: Number(json.rating || json.puan || 0),
            reviewCount: Number(json.reviewCount || json.yorum_sayisi || 0),
            owner: json.owner ? User_1.User.fromJSON(json.owner) : null,
            products: Array.isArray(json.products) ? json.products.map((p) => StationProduct.fromJSON(p)) : [],
            equipment: Array.isArray(json.equipment) ? json.equipment.map((e) => WorkstationEquipment.fromJSON(e)) : [],
            pricing: json.pricing,
            coupons: Array.isArray(json.coupons) ? json.coupons.map((c) => StationCoupon.fromJSON(c)) : [],
            facilities: json.facilities,
        });
    }
}
exports.Station = Station;
