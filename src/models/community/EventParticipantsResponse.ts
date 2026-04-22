/**
 * Individual player participating in an event.
 */
export interface EventParticipantPlayer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role?: string;
}

/**
 * Group/Team participating in an event.
 */
export interface EventParticipantGroup {
  id: number;
  name: string;
  shortName?: string;
  logo: string;
  banner?: string;
  url: string;
  players: EventParticipantPlayer[];
}

/**
 * Standardized response for event participants list.
 */
export interface EventParticipantsResponse {
  groups: EventParticipantGroup[];
  individuals: EventParticipantPlayer[];
}
