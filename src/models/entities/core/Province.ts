import { ProvinceDTO } from '../../dto/core/LocationDTO';

export class Province implements ProvinceDTO {
  id: number;
  name: string;
  countryId?: number;
  plateCode?: number;
  phoneCode?: number;

  constructor(data: ProvinceDTO) {
    this.id = data.id;
    this.name = data.name;
    this.countryId = data.countryId;
    this.plateCode = data.plateCode;
    this.phoneCode = data.phoneCode;
  }

  /**
   * Returns formatted plate code (e.g., 34).
   */
  get formattedPlate(): string {
    if (!this.plateCode) return '';
    return this.plateCode < 10 ? `0${this.plateCode}` : `${this.plateCode}`;
  }

  /**
   * Factory method to create a Province from a DTO.
   */
  static fromJSON(data: ProvinceDTO): Province {
    return new Province(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ProvinceDTO {
    return {
      id: this.id,
      name: this.name,
      countryId: this.countryId,
      plateCode: this.plateCode,
      phoneCode: this.phoneCode
    };
  }
}
