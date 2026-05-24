export interface WorkplaceDTO {
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
}
