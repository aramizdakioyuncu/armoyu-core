/**
 * Represents a Forum Board (Forum Bölümü) in the aramizdakioyuncu.com platform.
 */
export class Forum {
  id: string = '';
  name: string = '';
  desc: string = '';
  topicCount: number = 0;
  postCount: number = 0;
  lastPost?: {
    topicTitle: string;
    author: string;
    avatar: string;
    time: string;
  };

  constructor(data: Partial<Forum>) {
    Object.assign(this, data);
  }

  /**
   * Returns the absolute URL to the forum board.
   */
  getUrl(): string {
    return `/forum/${this.id}`;
  }

  /**
   * Instantiates a Forum object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Forum {
    return new Forum({
      id: json.id || '',
      name: json.name || json.title || '',
      desc: json.desc || json.description || '',
      topicCount: json.topicCount || 0,
      postCount: json.postCount || 0,
      lastPost: json.lastPost || null,
    });
  }
}
