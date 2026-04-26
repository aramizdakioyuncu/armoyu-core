export interface GlobalSearchResultDTO {
  id: number;
  type: string;
  title: string;
  displayName?: string;
  username?: string;
  gender?: string;
  image: string;
  url: string;
}

export interface TagDTO {
  id: number;
  value: string;
  useCount: number;
  firstDate: string;
}
