import { BaseModel } from '../BaseModel';

/**
 * System Settings Model
 * Platform genelindeki tüm ayarları tek bir noktadan yönetmek için tasarlanmıştır.
 */
export class SystemSettings extends BaseModel {
  siteTitle: string;
  siteDescription: string;
  isMaintenanceMode: boolean;
  isRegistrationOpen: boolean;
  contactEmail: string;
  version: string;
  socialLinks: {
    discord?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    github?: string;
  };
  branding: {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
  };

  constructor(data: Partial<SystemSettings> = {}) {
    super();
    this.siteTitle = data.siteTitle || 'ARMOYU - Aramızdaki Oyuncu';
    this.siteDescription = data.siteDescription || 'Türkiye\'nin en büyük oyun topluluğu ve gelişim platformu.';
    this.isMaintenanceMode = data.isMaintenanceMode || false;
    this.isRegistrationOpen = data.isRegistrationOpen || true;
    this.contactEmail = data.contactEmail || 'iletisim@armoyu.com';
    this.version = data.version || 'v3.4.2-beta';
    this.socialLinks = data.socialLinks || {
      discord: 'https://discord.gg/armoyu',
      youtube: 'https://youtube.com/armoyu',
      instagram: 'https://instagram.com/armoyu',
      twitter: 'https://twitter.com/armoyu',
      github: 'https://github.com/armoyu'
    };
    this.branding = data.branding || {
      logoUrl: 'https://v3.armoyu.com/logo.png',
      faviconUrl: 'https://v3.armoyu.com/favicon.ico',
      primaryColor: '#3b82f6'
    };
  }

  /**
   * Instantiates a SystemSettings object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): SystemSettings {
    if (BaseModel.usePreviousApi) {
      return SystemSettings.legacyFromJSON(json);
    }
    return SystemSettings.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): SystemSettings {
    return new SystemSettings({
      siteTitle: json.siteTitle || json.site_title || '',
      siteDescription: json.siteDescription || json.site_description || '',
      isMaintenanceMode: json.isMaintenanceMode || json.maintenance_mode || false,
      isRegistrationOpen: json.isRegistrationOpen || json.registration_open || true,
      contactEmail: json.contactEmail || json.contact_email || '',
      version: json.version || '',
      socialLinks: json.socialLinks || json.social_links || {},
      branding: json.branding || {}
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): SystemSettings {
    return new SystemSettings({});
  }

  /**
   * Ayarların bir kopyasını oluşturur (State yönetimi için)
   */
  clone(): SystemSettings {
    return new SystemSettings(JSON.parse(JSON.stringify(this)));
  }

  /**
   * Bakım modunu hızlıca değiştirir
   */
  toggleMaintenance() {
    this.isMaintenanceMode = !this.isMaintenanceMode;
  }
}
