/**
 * Represents a Game in the aramizdakioyuncu.com platform.
 */
export class Game {
  id: string = '';
  name: string = '';
  slug: string = '';
  logo: string = '';
  poster: string = '';
  category: string = '';
  developer: string = '';
  description: string = '';

  constructor(data: Partial<Game>) {
    Object.assign(this, data);
    if (!this.slug && this.name) {
      this.slug = this.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }

  /**
   * Instantiates a Game object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Game {
    return new Game({
      id: json.id || '',
      name: json.name || '',
      slug: json.slug || '',
      logo: json.logo || json.logo_url || '',
      poster: json.poster || json.poster_url || '',
      category: json.category || '',
      developer: json.developer || '',
      description: json.description || '',
    });
  }
}
