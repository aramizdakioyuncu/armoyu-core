import { MediaCategory } from '../social/meta/MediaEnums';

export interface MediaResponse {
  id: number;
  owner: {
    id: number;
    username: string;
    avatar: string;
  };
  time: string;
  size: string;
  category: MediaCategory;
  isPublic: boolean;
  type: string;
  url: {
    original: string;
    large: string;
    small: string;
    thumb: string;
  };
  title: string;
}

export interface MediaUploadResultDTO {
  url: string;
  key: string;
  mediaId: number;
  category: string;
  fileType: string;
  fileSize: string;
}
