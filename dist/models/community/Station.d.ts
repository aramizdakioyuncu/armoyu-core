import { User } from '../auth/User';
export type StationType = 'YEMEK' | 'INTERNET_KAFE' | 'HALI_SAHA' | 'SPOR_KOMPLEKSI';
/**
 * Represents a menu item or a product in a station.
 */
export declare class StationProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    isDeal?: boolean;
    discountRate?: string;
    constructor(data: Partial<StationProduct>);
    static fromJSON(json: Record<string, any>): StationProduct;
}
/**
 * Represents detailed hardware/equipment in a workstation setup.
 */
export declare class WorkstationEquipment {
    id: string;
    name: string;
    cpu: string;
    gpu: string;
    ram: string;
    monitor: string;
    keyboard: string;
    mouse: string;
    isAvailable?: boolean;
    constructor(data: Partial<WorkstationEquipment>);
    static fromJSON(json: Record<string, any>): WorkstationEquipment;
}
export interface StationPricing {
    label: string;
    price: number;
    unit: string;
}
export declare class StationCoupon {
    code: string;
    discount: string;
    expiryDate: string;
    description: string;
    constructor(data: Partial<StationCoupon>);
    static fromJSON(json: Record<string, any>): StationCoupon;
}
/**
 * Represents a Station (İstasyon) in the aramizdakioyuncu.com platform.
 */
export declare class Station {
    id: string;
    name: string;
    slug: string;
    type: StationType;
    description: string;
    location: string;
    logo: string;
    banner: string;
    rating: number;
    reviewCount: number;
    owner: User | null;
    products?: StationProduct[];
    equipment?: WorkstationEquipment[];
    pricing?: StationPricing[];
    coupons?: StationCoupon[];
    facilities?: string[];
    constructor(data: Partial<Station>);
    static fromJSON(json: Record<string, any>): Station;
}
