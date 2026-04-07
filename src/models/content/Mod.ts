import { User } from '../auth/User';

/**
 * Represents a Game Mod (Oyun Modu) in the aramizdakioyuncu.com platform.
 */
export class Mod {
  id: string = '';
  name: string = '';
  game: string = '';
  version: string = '';
  author: User | null = null;
  description: string = '';
  downloads: string = '';
  image: string = '';
  isFeatured: boolean = false;

  constructor(data: Partial<Mod>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Mod object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Mod {
    return new Mod({
      id: json.id || '',
      name: json.name || json.title || '',
      game: json.game || '',
      version: json.version || '',
      author: json.author ? (json.author instanceof User ? json.author : User.fromJSON(json.author)) : (json.authorUsername ? new User({ username: json.authorUsername, displayName: json.authorName }) : null),
      description: json.description || json.desc || '',
      downloads: json.downloads || '0',
      image: json.image || '',
      isFeatured: json.isFeatured || false,
    });
  }
}
