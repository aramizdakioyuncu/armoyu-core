/**
 * Represents a Media item (Fotoğraf/Video) in the aramizdakioyuncu.com platform.
 */
export class Media {
  title: string = '';
  count: number = 0;
  author: string = '';
  date: string = '';
  category: string = '';
  image: string = '';

  constructor(data: Partial<Media>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a Media object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Media {
    return new Media({
      title: json.title || '',
      count: json.count || 0,
      author: json.author || '',
      date: json.date || '',
      category: json.category || '',
      image: json.image || json.thumb || '',
    });
  }
}
