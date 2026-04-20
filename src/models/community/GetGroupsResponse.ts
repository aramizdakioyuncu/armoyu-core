import { BaseResponse } from '../core/BaseResponse';
import { GroupResponse } from './GroupResponse';

export interface GetGroupsResponse extends BaseResponse<GroupResponse[]> {}
