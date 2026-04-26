import { ProjectDTO } from '../../dto/content/ContentDTO';

export class Project implements ProjectDTO {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  url?: string;
  category?: string;
  status?: string;

  constructor(data: ProjectDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.logo = data.logo;
    this.banner = data.banner;
    this.url = data.url;
    this.category = data.category;
    this.status = data.status;
  }

  /**
   * Returns a friendly URL for the project.
   */
  get projectUrl(): string {
    return `/proje/${this.url || this.id}`;
  }

  /**
   * Returns true if the project is active.
   */
  get isActive(): boolean {
    return this.status?.toLowerCase() === 'aktif' || this.status === '1';
  }

  /**
   * Factory method to create a Project from a DTO.
   */
  static fromJSON(data: ProjectDTO): Project {
    return new Project(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ProjectDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      logo: this.logo,
      banner: this.banner,
      url: this.url,
      category: this.category,
      status: this.status
    };
  }
}
