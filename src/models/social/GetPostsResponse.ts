export interface ArmoyuPostOwnerMedia {
  media_bigURL: string;
  media_URL: string;
  media_minURL: string;
}

export interface ArmoyuPostOwner {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  url?: string;
  job?: string;
  jobURL?: string;
  adsoyad?: string;
  kullaniciadi?: string;
  displayname?: string;
}

export interface ArmoyuPostMedia {
  id: number;
  owner: ArmoyuPostOwner;
  category: string;
  url: string;
  smallUrl: string;
  thumbnailUrl: string;
  orientation: string;
}

export interface ArmoyuPostLiker {
  likeId: number;
  id: number;
  displayName: string;
  username: string;
  avatar: string;
  url: string;
  date: string;
}

export interface ArmoyuPostComment {
  postId: number;
  id: number;
  authorId: number;
  authorTag?: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  authorLink?: string;
  authorSmallAvatar?: string;
  authorThumbnailAvatar?: string;
  content: string;
  date: string;
  timeLabel?: string;
  replyTo?: number;
  likesCount: number;
  reportsCount: number;
  isLiked: boolean;
  isReported: boolean;
}

export interface ArmoyuPost {
  id: number;
  owner: ArmoyuPostOwner;
  content: string;
  location?: string;
  date: string;
  timeLabel?: string;
  editDate?: string | null;
  topLikers: ArmoyuPostLiker[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  reportsCount: number;
  likeCount?: number;
  commentCount?: number;
  repostCount?: number;
  reportCount?: number;
  paylasimzaman?: string;
  paylasimzamangecen?: string;
  paylasimicerik?: string;
  isLiked: boolean;
  isCommented: boolean;
  isReposted: boolean;
  isReported: boolean;
  mappedMedia: ArmoyuPostMedia[];
  paylasimfoto?: any[];
  media?: ArmoyuPostMedia[];
  topComments: ArmoyuPostComment[];
}

export interface GetPostsResponse {
  icerik: ArmoyuPost[];
  kod: number;
  durum: number;
  aciklama: string;
}
