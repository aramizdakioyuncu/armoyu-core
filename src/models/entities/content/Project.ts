import { ProjectDTO, ProjectLanguageDTO, ProjectOwnerDTO, ProjectMemberDTO } from '../../dto/content/ContentDTO';

export class Project implements ProjectDTO {
  id: number;
  name: string;
  description?: string;
  version?: string;
  link?: string;
  shortname?: string;
  downloads?: number;
  apiId?: string;
  contact?: string;
  privacyPolicy?: string;
  logo?: string;
  banner?: string;
  url?: string;
  category?: string;
  status?: string;
  language?: ProjectLanguageDTO;
  owner?: ProjectOwnerDTO;
  members?: ProjectMemberDTO[];

  constructor(data: ProjectDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.version = data.version;
    this.link = data.link;
    this.shortname = data.shortname;
    this.downloads = data.downloads;
    this.apiId = data.apiId;
    this.contact = data.contact;
    this.privacyPolicy = data.privacyPolicy;
    this.logo = data.logo;
    this.banner = data.banner;
    this.url = data.url;
    this.category = data.category;
    this.status = data.status;
    this.language = data.language;
    this.owner = data.owner;
    this.members = data.members;
  }

  get projectUrl(): string {
    return `/proje/${this.shortname || this.url || this.id}`;
  }

  get isActive(): boolean {
    return this.status?.toLowerCase() === 'aktif' || this.status === '1';
  }

  static fromJSON(data: ProjectDTO): Project {
    return new Project(data);
  }

  toJSON(): ProjectDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      link: this.link,
      shortname: this.shortname,
      downloads: this.downloads,
      apiId: this.apiId,
      contact: this.contact,
      privacyPolicy: this.privacyPolicy,
      logo: this.logo,
      banner: this.banner,
      url: this.url,
      category: this.category,
      status: this.status,
      language: this.language,
      owner: this.owner,
      members: this.members
    };
  }
}
