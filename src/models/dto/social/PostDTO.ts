export interface PostOwnerDTO {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  url?: string;
  job?: string;
}

export interface PostMediaDTO {
  id: number;
  owner: PostOwnerDTO;
  category: string;
  url: string;
  smallUrl: string;
  thumbnailUrl: string;
  orientation: string;
}

export interface PostLikerDTO {
  likeId: number;
  id: number;
  displayName: string;
  username: string;
  avatar: string;
  url: string;
  date: string;
}

export interface PostCommentDTO {
  postId: number;
  id: number;
  authorId: number;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  content: string;
  date: string;
  likesCount: number;
  reportsCount: number;
  isLiked: boolean;
  isReported: boolean;
}

export interface PostDTO {
  id: number;
  owner: PostOwnerDTO;
  content: string;
  location?: string;
  date: string;
  timeLabel?: string;
  editDate?: string | null;
  topLikers: PostLikerDTO[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  reportsCount: number;
  isLiked: boolean;
  isCommented: boolean;
  isReposted: boolean;
  isReported: boolean;
  mappedMedia: PostMediaDTO[];
  topComments: PostCommentDTO[];
}
