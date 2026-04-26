import { CountryDTO } from '../../dto/core/LocationDTO';

export class Country implements CountryDTO {
  id: number;
  name: string;
  code?: string;
  phoneCode?: number;

  constructor(data: CountryDTO) {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
    this.phoneCode = data.phoneCode;
  }

  /**
   * Returns formatted phone code (e.g., +90).
   */
  get formattedPhoneCode(): string {
    if (!this.phoneCode) return '';
    return `+${this.phoneCode}`;
  }

  /**
   * Factory method to create a Country from a DTO.
   */
  static fromJSON(data: CountryDTO): Country {
    return new Country(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): CountryDTO {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      phoneCode: this.phoneCode
    };
  }
}
