export interface UserMedia {
  media_ID?: number;
  media_URL?: string;
  media_bigURL?: string;
  media_minURL?: string;
}

export class User {
  // Common IDs
  id_user?: string | number;
  user_id?: string | number;
  id?: string | number;
  playerID?: string | number;
  player_ID?: string | number;
  oyuncuID?: string | number;
  oyuncu_ID?: string | number;

  // Username
  username?: string;
  player_userlogin?: string;
  user_name?: string;
  oyuncu_ad?: string;
  oyuncukullaniciad?: string;
  oyuncukullaniciadi?: string;

  // Display Name
  displayname?: string;
  player_displayname?: string;
  displayName?: string;
  user_displayname?: string;
  name?: string;
  oyuncuad?: string;
  oyuncu_ad_soyad?: string;

  // Basic Info
  firstName?: string;
  lastName?: string;
  oyuncu_bio?: string;
  bio?: string;
  aciklama?: string;

  // Avatar & Media
  avatar?: string | UserMedia;
  player_avatar?: string | UserMedia;
  banner?: string | UserMedia;
  oyuncu_kapak?: string | UserMedia;
  wallpaper?: string | UserMedia;

  // Status & Verification
  verified?: boolean | number;
  oyuncu_onay?: number | string;
  isOnline?: boolean | number;
  oyuncu_online?: number | string;
  lastSeen?: string;

  // Leveling & Stats
  level?: number | string;
  oyuncu_seviye?: number | string;
  xp?: number | string;
  user_xp?: number | string;
  popScore?: number | string;
  user_popscore?: number | string;
  ODP?: number | string;
  rating?: number | string;

  // Geography & Details
  location?: string;
  sehir?: string;
  detailInfo?: any;
  oyuncu_rutbe?: any;
  job?: any;

  // Lists
  groups?: any[];
  friends?: any[];
  arkadasliste?: any[];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}



