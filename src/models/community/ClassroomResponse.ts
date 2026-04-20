import { BaseResponse } from '../core/BaseResponse';

export interface ClassroomResponse {
  id: number;
  name: string;
  facultyId: number;
}

export interface GetClassroomsResponse extends BaseResponse<ClassroomResponse[]> {}
