import { BaseResponse } from '../core/BaseResponse';

/**
 * Represents a School or Educational Institution.
 */
export interface SchoolResponse {
  id: number;
  name: string;
  logo: string;
  logo_small?: string;
  logo_mini?: string;
  logoSmall?: string; // CamelCase fallback
  logoTiny?: string;  // CamelCase fallback
  url: string;
  okul_URL?: string;  // Raw fallback
  type?: string;
  website?: string;
  city?: string;
  district?: string;
  memberCount: number;
  description?: string;
}

export interface GetSchoolsResponse extends BaseResponse<SchoolResponse[]> {}
