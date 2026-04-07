import { User } from '../auth/User';

export type StationType = 'YEMEK' | 'INTERNET_KAFE' | 'HALI_SAHA' | 'SPOR_KOMPLEKSI';

/**
 * Represents a menu item or a product in a station.
 */
export class StationProduct {
  id: string = '';
  name: string = '';
  price: number = 0;
  category: string = '';
  image?: string;
  isDeal?: boolean;
  discountRate?: string;

  constructor(data: Partial<StationProduct>) {
    Object.assign(this, data);
  }

  static fromJSON(json: Record<string, any>): StationProduct {
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

/**
 * Represents detailed hardware/equipment in a workstation setup.
 */
export class WorkstationEquipment {
  id: string = '';
  name: string = 'Standart Masa'; // e.g., "VIP Oda #1"
  cpu: string = '';
  gpu: string = '';
  ram: string = '';
  monitor: string = '';
  keyboard: string = '';
  mouse: string = '';
  isAvailable?: boolean = true;

  constructor(data: Partial<WorkstationEquipment>) {
    Object.assign(this, data);
  }

  static fromJSON(json: Record<string, any>): WorkstationEquipment {
    return new WorkstationEquipment({
      id: json.id || '',
      name: json.name || '',
      cpu: json.cpu || '',
      gpu: json.gpu || '',
      ram: json.ram || '',
      monitor: json.monitor || '',
      keyboard: json.keyboard || '',
      mouse: json.mouse || '',
      isAvailable: json.isAvailable ?? true,
    });
  }
}

export interface StationPricing {
  label: string;
  price: number;
  unit: string; // 'saat', 'gün', 'seans' vb.
}

export class StationCoupon {
  code: string = '';
  discount: string = '';
  expiryDate: string = '';
  description: string = '';

  constructor(data: Partial<StationCoupon>) {
    Object.assign(this, data);
  }

  static fromJSON(json: Record<string, any>): StationCoupon {
    return new StationCoupon({
      code: json.code || '',
      discount: json.discount || '',
      expiryDate: json.expiryDate || '',
      description: json.description || '',
    });
  }
}

/**
 * Represents a Station (İstasyon) in the aramizdakioyuncu.com platform.
 */
export class Station {
  id: string = '';
  name: string = '';
  slug: string = '';
  type: StationType = 'YEMEK';
  description: string = '';
  location: string = '';
  logo: string = '';
  banner: string = '';
  rating: number = 0;
  reviewCount: number = 0;
  owner: User | null = null;
  
  // Refactored to unified classes
  products?: StationProduct[] = [];
  equipment?: WorkstationEquipment[] = [];
  pricing?: StationPricing[] = [];
  coupons?: StationCoupon[] = [];
  facilities?: string[] = [];

  constructor(data: Partial<Station>) {
    Object.assign(this, data);
    if (!this.slug && this.name) {
      this.slug = this.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }

  static fromJSON(json: Record<string, any>): Station {
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
      owner: json.owner ? User.fromJSON(json.owner) : null,
      products: json.products?.map((p: any) => StationProduct.fromJSON(p)) || [],
      equipment: json.equipment?.map((e: any) => WorkstationEquipment.fromJSON(e)) || [],
      pricing: json.pricing,
      coupons: json.coupons?.map((c: any) => StationCoupon.fromJSON(c)) || [],
      facilities: json.facilities,
    });
  }
}
