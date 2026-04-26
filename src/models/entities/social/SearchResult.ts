import { GlobalSearchResultDTO, TagDTO } from '../../dto/social/SearchDTO';

export class SearchResult implements GlobalSearchResultDTO {
  id: number;
  type: string;
  title: string;
  displayName?: string;
  username?: string;
  gender?: string;
  image: string;
  url: string;

  constructor(data: GlobalSearchResultDTO) {
    this.id = data.id;
    this.type = data.type;
    this.title = data.title;
    this.displayName = data.displayName;
    this.username = data.username;
    this.gender = data.gender;
    this.image = data.image;
    this.url = data.url;
  }

  /**
   * Returns true if the result is a player.
   */
  get isPlayer(): boolean {
    return this.type === 'oyuncu';
  }

  /**
   * Returns true if the result is a group.
   */
  get isGroup(): boolean {
    return this.type === 'grup' || this.type === 'gruplar';
  }

  /**
   * Returns a friendly display name.
   */
  get display(): string {
    return this.displayName || this.title || this.username || 'İsimsiz';
  }

  /**
   * Factory method to create a SearchResult from a DTO.
   */
  static fromJSON(data: GlobalSearchResultDTO): SearchResult {
    return new SearchResult(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): GlobalSearchResultDTO {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      displayName: this.displayName,
      username: this.username,
      gender: this.gender,
      image: this.image,
      url: this.url
    };
  }
}

export class Tag implements TagDTO {
  id: number;
  value: string;
  useCount: number;
  firstDate: string;

  constructor(data: TagDTO) {
    this.id = data.id;
    this.value = data.value;
    this.useCount = data.useCount;
    this.firstDate = data.firstDate;
  }

  /**
   * Returns the tag with '#' prefix.
   */
  get hashtag(): string {
    return this.value.startsWith('#') ? this.value : `#${this.value}`;
  }

  /**
   * Factory method to create a Tag from a DTO.
   */
  static fromJSON(data: TagDTO): Tag {
    return new Tag(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): TagDTO {
    return {
      id: this.id,
      value: this.value,
      useCount: this.useCount,
      firstDate: this.firstDate
    };
  }
}
