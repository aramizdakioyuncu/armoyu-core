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
        var _a, _b, _c;
        return new Station({
            id: json.id || '',
            name: json.name || '',
            slug: json.slug || '',
            type: json.type || 'YEMEK',
            description: json.description || '',
            location: json.location || '',
            logo: json.logo || '',
            banner: json.banner || '',
            rating: json.rating || 0,
            reviewCount: json.reviewCount || 0,
            owner: json.owner ? User_1.User.fromJSON(json.owner) : null,
            products: ((_a = json.products) === null || _a === void 0 ? void 0 : _a.map((p) => StationProduct.fromJSON(p))) || [],
            equipment: ((_b = json.equipment) === null || _b === void 0 ? void 0 : _b.map((e) => WorkstationEquipment.fromJSON(e))) || [],
            pricing: json.pricing,
            coupons: ((_c = json.coupons) === null || _c === void 0 ? void 0 : _c.map((c) => StationCoupon.fromJSON(c))) || [],
            facilities: json.facilities,
        });
    }
}
exports.Station = Station;
