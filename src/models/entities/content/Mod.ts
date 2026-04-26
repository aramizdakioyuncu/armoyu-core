import { ModDTO } from '../../dto/content/ContentDTO';

export class Mod implements ModDTO {
  id: number;
  name: string;
  version?: string;
  gameId?: number;
  description?: string;
  logo?: string;
  downloadUrl?: string;
  authorId?: number;
  authorName?: string;

  constructor(data: ModDTO) {
    this.id = data.id;
    this.name = data.name;
    this.version = data.version;
    this.gameId = data.gameId;
    this.description = data.description;
    this.logo = data.logo;
    this.downloadUrl = data.downloadUrl;
    this.authorId = data.authorId;
    this.authorName = data.authorName;
  }

  /**
   * Returns display name with version.
   */
  get fullName(): string {
    return this.version ? `${this.name} v${this.version}` : this.name;
  }

  /**
   * Factory method to create a Mod from a DTO.
   */
  static fromJSON(data: ModDTO): Mod {
    return new Mod(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ModDTO {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      gameId: this.gameId,
      description: this.description,
      logo: this.logo,
      downloadUrl: this.downloadUrl,
      authorId: this.authorId,
      authorName: this.authorName
    };
  }
}
