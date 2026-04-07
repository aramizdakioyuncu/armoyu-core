import { User } from '../auth/User';

/**
 * Represents a "Note" (Instagram-style status bubble) in the aramizdakioyuncu.com platform.
 */
export class Note {
  id: string = '';
  user: User | null = null;
  note: string = '';
  isMe: boolean = false;

  constructor(data: Partial<Note>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Note object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Note {
    return new Note({
      id: json.id || '',
      user: json.user ? User.fromJSON(json.user) : null,
      note: json.note || '',
      isMe: json.isMe || false,
    });
  }
}
