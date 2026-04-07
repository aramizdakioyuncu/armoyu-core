/**
 * System Settings Model
 * Platform genelindeki tüm ayarları tek bir noktadan yönetmek için tasarlanmıştır.
 */
export declare class SystemSettings {
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
    constructor(data?: Partial<SystemSettings>);
    /**
     * Ayarların bir kopyasını oluşturur (State yönetimi için)
     */
    clone(): SystemSettings;
    /**
     * Bakım modunu hızlıca değiştirir
     */
    toggleMaintenance(): void;
}
