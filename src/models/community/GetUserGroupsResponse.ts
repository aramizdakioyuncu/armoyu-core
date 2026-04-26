import { BaseResponse } from '../core/BaseResponse';
import { GroupDTO } from '../dto/community/GroupDTO';

export interface GetUserGroupsResponse extends BaseResponse<GroupDTO[]> {}
