import { WorkplaceDTO } from '../../dto/community/WorkplaceDTO';

export class Workplace implements WorkplaceDTO {
  id: number;
  name: string;
  type: string;
  typeDetail: string;
  logo: string;
  logoSmall: string;
  logoMini: string;
  photo: string;
  photoSmall: string;
  photoMini: string;
  shortName: string;
  countryId: number;
  cityId: number;
  districtId: number;
  urlSlug: string;
  about: string;
  joinPassword: string;
  memberCount: number;
  representative: string | null;

  constructor(data: WorkplaceDTO) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.typeDetail = data.typeDetail;
    this.logo = data.logo;
    this.logoSmall = data.logoSmall;
    this.logoMini = data.logoMini;
    this.photo = data.photo;
    this.photoSmall = data.photoSmall;
    this.photoMini = data.photoMini;
    this.shortName = data.shortName;
    this.countryId = data.countryId;
    this.cityId = data.cityId;
    this.districtId = data.districtId;
    this.urlSlug = data.urlSlug;
    this.about = data.about;
    this.joinPassword = data.joinPassword;
    this.memberCount = data.memberCount;
    this.representative = data.representative;
  }

  static fromJSON(data: WorkplaceDTO): Workplace {
    return new Workplace(data);
  }
}
