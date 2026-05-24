import { CountyDTO } from '../../dto/core/LocationDTO';

export class County implements CountyDTO {
  id: number;
  name: string;
  provinceId?: number;

  constructor(data: CountyDTO) {
    this.id = data.id;
    this.name = data.name;
    this.provinceId = data.provinceId;
  }

  static fromJSON(data: CountyDTO): County {
    return new County(data);
  }

  toJSON(): CountyDTO {
    return {
      id: this.id,
      name: this.name,
      provinceId: this.provinceId
    };
  }
}
