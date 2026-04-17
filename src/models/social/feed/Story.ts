import { StoryItem } from './StoryItem';

export interface Story {
  id?: string | number;
  author?: any;
  items?: StoryItem[];
  isSeen?: boolean;
}
