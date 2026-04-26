export interface EventOrganizerDTO {
  id: number;
  displayName: string;
  avatar: string;
}

export interface EventDTO {
  id: number;
  name: string;
  description?: string;
  category?: string;
  logo: string;
  banner?: string;
  url: string;
  date: string;
  location?: string;
  gameId: number;
  gameName: string;
  gameLogo?: string;
  gameBanner?: string;
  status: number;
  participantType?: string;
  participantCount: number;
  participantLimit: number;
  groupPlayerLimit?: number;
  rules?: string;
  organizers: EventOrganizerDTO[];
  isJoined: boolean;
  dlc?: any[];
  files?: any[];
  detail?: any[];
}

export interface EventParticipantGroupDTO {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  banner?: string;
  url: string;
  players: EventParticipantPlayerDTO[];
}

export interface EventParticipantPlayerDTO {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role?: string;
}

export interface EventParticipantsDTO {
  groups: EventParticipantGroupDTO[];
  individuals: EventParticipantPlayerDTO[];
}
