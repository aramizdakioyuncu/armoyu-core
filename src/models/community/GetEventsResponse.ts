import { BaseResponse } from '../core/BaseResponse';
import { EventResponse } from './EventResponse';

export interface GetEventsResponse extends BaseResponse<EventResponse[]> {}
