import { BaseResponse } from '../core/BaseResponse';

export interface SchoolResponse {
  id: number;
  name: string;
  logo?: string;
  logo_small?: string;
  logo_mini?: string;
  url?: string;
  type?: string;
  website?: string;
  city?: string;
  district?: string;
  memberCount?: number;
  description?: string;
}

export interface GetSchoolsResponse extends BaseResponse<SchoolResponse[]> {}
