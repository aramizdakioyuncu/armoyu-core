import { PollOption } from './PollOption';

export interface Poll {
  id?: string | number;
  question?: string;
  options?: PollOption[];
  totalVotes?: number;
  expiresAt?: string;
  isClosed?: boolean;
}



