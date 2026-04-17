export interface GroupMedia {
  media_ID?: number;
  media_URL?: string;
  media_bigURL?: string;
  media_minURL?: string;
}

export interface Group {
  id: string | number;
  name: string;
  shortName?: string;
  slug?: string;
  description?: string;
  category?: string;
  tag?: string;
  logo?: string | GroupMedia;
  banner?: string | GroupMedia;
  wallpaper?: string | GroupMedia;
  recruitmentStatus?: string | number;
  date?: string;
  memberCount?: number;
  isPrivate?: boolean;
  owner?: any;
  moderators?: any[];
  members?: any[];
  url?: string;
}



