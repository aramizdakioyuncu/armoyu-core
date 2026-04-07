import { User } from '../auth/User';

/**
 * Represents a Story in the aramizdakioyuncu.com platform.
 */
export class Story {
  id: string = '';
  user: User | null = null;
  media: string = '';
  hasUnseen: boolean = false;
  isMe: boolean = false;

  constructor(data: Partial<Story>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Story object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Story {
    return new Story({
      id: json.id || '',
      user: json.user ? User.fromJSON(json.user) : (json.username ? new User({ username: json.username, avatar: json.avatar }) : null),
      media: json.media || '',
      hasUnseen: json.hasUnseen || false,
      isMe: json.isMe || false,
    });
  }
}
