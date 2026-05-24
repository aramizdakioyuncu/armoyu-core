export interface ManagementUserDTO {
  userNumber: string;
  username: string;
  displayName: string;
  avatar: string;
  role: string;
  registeredBy: string;
  age: number;
  lastLogin: string;
  remainingRights: number;
  isProblem: boolean;
}

export interface ManagementMeetingDTO {
  id: number;
  name: string;
  creatorName: string;
  creatorAvatar: string;
  date: string;
  participantCount: number;
  participantLimit: string;
  status: string;
}
