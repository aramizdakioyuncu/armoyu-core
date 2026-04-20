import { BaseResponse } from '../core/BaseResponse';
import { PostCommentResponse } from './GetPostsResponse';

export interface GetCommentsResponse extends BaseResponse<PostCommentResponse[]> {}
