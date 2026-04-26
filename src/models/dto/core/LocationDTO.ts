export interface CountryDTO {
  id: number;
  name: string;
  code?: string;
  phoneCode?: number;
}

export interface ProvinceDTO {
  id: number;
  name: string;
  countryId?: number;
  plateCode?: number;
  phoneCode?: number;
}

export interface PlatformStatsDTO {
  activeUsers: number;
  totalUsers: number;
  totalGroups: number;
  totalEvents: number;
  activeUsers24h: number;
}
