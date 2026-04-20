import { PollOptionResponse } from './PollOptionResponse';

export interface PollResponse {
  id: number;
  question: string;
  description?: string;
  type?: string;
  status?: number;
  endDate?: string;
  totalVotes?: number;
  isVoted?: boolean;
  selectedOptionId?: number;
  votingPercentage?: string;
  options?: PollOptionResponse[];
  owner?: {
    id: number;
    displayName: string;
    avatar?: string;
  };
  images?: {
    id: number;
    url: string;
    thumbnail: string;
  }[];
}
