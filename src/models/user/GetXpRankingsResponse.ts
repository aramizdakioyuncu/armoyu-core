import { UserResponse } from '../auth/UserResponse';
import { BaseResponse } from '../core/BaseResponse';

export interface GetXpRankingsResponse extends BaseResponse<UserResponse[]> {}
