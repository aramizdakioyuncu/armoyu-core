import { SchoolDTO } from '../../dto/community/EducationDTO';

export class School implements SchoolDTO {
  id: number;
  name: string;
  logo: string;
  logoSmall?: string;
  logoMini?: string;
  url: string;
  type?: string;
  website?: string;
  city?: string;
  district?: string;
  memberCount: number;
  description?: string;

  constructor(data: SchoolDTO) {
    this.id = data.id;
    this.name = data.name;
    this.logo = data.logo;
    this.logoSmall = data.logoSmall;
    this.logoMini = data.logoMini;
    this.url = data.url;
    this.type = data.type;
    this.website = data.website;
    this.city = data.city;
    this.district = data.district;
    this.memberCount = data.memberCount;
    this.description = data.description;
  }

  /**
   * Returns a clean portal URL for the school.
   */
  get portalUrl(): string {
    return `/okul/${this.url || this.id}`;
  }

  /**
   * Returns true if it's a university.
   */
  get isUniversity(): boolean {
    return this.type?.toLowerCase().includes('üniversite') || false;
  }

  /**
   * Returns full location string.
   */
  /**
   * Returns full location string.
   */
  get fullLocation(): string {
    if (this.city && this.district) return `${this.district}, ${this.city}`;
    return this.city || this.district || 'Belirtilmemiş';
  }

  /**
   * Factory method to create a School from a DTO.
   */
  static fromJSON(data: SchoolDTO): School {
    return new School(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): SchoolDTO {
    return {
      id: this.id,
      name: this.name,
      logo: this.logo,
      logoSmall: this.logoSmall,
      logoMini: this.logoMini,
      url: this.url,
      type: this.type,
      website: this.website,
      city: this.city,
      district: this.district,
      memberCount: this.memberCount,
      description: this.description
    };
  }
}
