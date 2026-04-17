export interface Survey {
  id?: string | number;
  question?: string;
  description?: string;
  createdAt?: string;
  expiresAt?: string;
  author?: any;
  options?: any[];
  hasVoted?: boolean;
  myVoteId?: string | number;
}
