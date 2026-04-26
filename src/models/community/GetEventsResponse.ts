import { BaseResponse } from '../core/BaseResponse';
import { ArmoyuEvent } from '../entities/community/Event';

export interface GetEventsResponse extends BaseResponse<ArmoyuEvent[]> {}
