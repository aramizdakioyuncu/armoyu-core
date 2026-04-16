import { StoryItem } from './StoryItem';

export class Story {
  id?: string | number;
  author?: any;
  items?: StoryItem[];
  isSeen?: boolean;

  constructor(data?: Partial<Story>) {
    Object.assign(this, data);
  }
}
