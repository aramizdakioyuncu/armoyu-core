import { BaseModel } from '../BaseModel';
import { User } from '../auth/User';

export type StationType = 'YEMEK' | 'INTERNET_KAFE' | 'HALI_SAHA' | 'SPOR_KOMPLEKSI';

/**
 * Represents a menu item or a product in a station.
 */
export class StationProduct extends BaseModel {
  id: string = '';
  name: string = '';
  price: number = 0;
  category: string = '';
  image?: string;
  isDeal?: boolean;
  discountRate?: string;

  constructor(data: Partial<StationProduct>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a StationProduct object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): StationProduct {
    if (BaseModel.usePreviousApi) {
      return StationProduct.legacyFromJSON(json);
    }
    return StationProduct.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): StationProduct {
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

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): StationProduct {
    return new StationProduct({});
  }
}

/**
 * Represents detailed hardware/equipment in a workstation setup.
 */
export class WorkstationEquipment extends BaseModel {
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
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a WorkstationEquipment object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): WorkstationEquipment {
    if (BaseModel.usePreviousApi) {
      return WorkstationEquipment.legacyFromJSON(json);
    }
    return WorkstationEquipment.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): WorkstationEquipment {
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

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): WorkstationEquipment {
    return new WorkstationEquipment({});
  }
}

export interface StationPricing {
  label: string;
  price: number;
  unit: string; // 'saat', 'gün', 'seans' vb.
}

export class StationCoupon extends BaseModel {
  code: string = '';
  discount: string = '';
  expiryDate: string = '';
  description: string = '';

  constructor(data: Partial<StationCoupon>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates a StationCoupon object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): StationCoupon {
    if (BaseModel.usePreviousApi) {
      return StationCoupon.legacyFromJSON(json);
    }
    return StationCoupon.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): StationCoupon {
    return new StationCoupon({
      code: json.code || '',
      discount: json.discount || '',
      expiryDate: json.expiryDate || '',
      description: json.description || '',
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): StationCoupon {
    return new StationCoupon({});
  }
}

/**
 * Represents a Station (İstasyon) in the aramizdakioyuncu.com platform.
 */
export class Station extends BaseModel {
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
    super();
    Object.assign(this, data);
    if (!this.slug && this.name) {
      this.slug = this.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }

  /**
   * Instantiates a Station object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): Station {
    if (BaseModel.usePreviousApi) {
      return Station.legacyFromJSON(json);
    }
    return Station.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): Station {
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

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): Station {
    return new Station({});
  }
}
