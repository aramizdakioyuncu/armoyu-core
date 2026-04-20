import { UserResponse } from '../auth/UserResponse';
import { BaseResponse } from '../core/BaseResponse';

export interface GetPopRankingsResponse extends BaseResponse<UserResponse[]> {}
