import { BaseResponse } from '../core/BaseResponse';

export interface FacultyResponse {
  id: number;
  name: string;
  schoolId: number;
}

export interface GetFacultiesResponse extends BaseResponse<FacultyResponse[]> {}
