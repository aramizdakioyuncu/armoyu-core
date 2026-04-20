import { UserResponse } from '../auth/UserResponse';
import { BaseResponse } from '../core/BaseResponse';

export interface GetFriendsResponse extends BaseResponse<UserResponse[]> {}
