import { BaseResponse } from '../core/BaseResponse';
import { GroupResponse } from './GroupResponse';

export interface GetUserGroupsResponse extends BaseResponse<GroupResponse[]> {}
