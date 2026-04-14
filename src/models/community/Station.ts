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
    if (!json) return new Station({});

    // Handle potential metadata objects (Station_URL, etc.)
    const urlMetadata = json.Station_URL || json.station_URL || json.durak_URL || json.durakURL || {};
    const hasUrlMetadata = typeof urlMetadata === 'object' && Object.keys(urlMetadata).length > 0;

    // Resolve Logo
    const logoField = json.Station_logo || json.station_logo || json.durak_logo || json.avatar || {};
    let logoData = logoField;
    if (hasUrlMetadata) {
      const metadataLogo = urlMetadata.Station_logo || urlMetadata.station_logo || urlMetadata.durak_logo || urlMetadata.logo;
      if (metadataLogo) logoData = metadataLogo;
    }

    // Resolve Banner
    const bannerData = json.Banner || json.banner || json.durak_kapak || json.wallpaper || {};

    // Resolve Slug
    let slug = json.slug || json.url || '';
    if (hasUrlMetadata) {
      slug = urlMetadata.url || urlMetadata.slug || slug;
      if (typeof urlMetadata === 'string' && !slug) slug = urlMetadata;
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
      owner: json.owner ? User.fromJSON(json.owner) : null,
      products: Array.isArray(json.products) ? json.products.map((p: any) => StationProduct.fromJSON(p)) : [],
      equipment: Array.isArray(json.equipment) ? json.equipment.map((e: any) => WorkstationEquipment.fromJSON(e)) : [],
      pricing: json.pricing,
      coupons: Array.isArray(json.coupons) ? json.coupons.map((c: any) => StationCoupon.fromJSON(c)) : [],
      facilities: json.facilities,
    });
  }
}
