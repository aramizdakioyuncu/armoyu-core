export interface EventOrganizerResponse {
  id?: string | number;
  displayName?: string;
  avatar?: string;
}

/**
 * Standardized Event interface for the library.
 */
export interface EventResponse {
  id?: string | number;
  name?: string;
  title?: string;
  status?: number;
  category?: string;
  link?: string;
  url?: string;
  thumbnail?: string;
  logo?: string;
  banner?: string;
  image?: string;
  gameId?: string | number;
  gameName?: string;
  gameLogo?: string;
  gameBanner?: string;
  organizers?: EventOrganizerResponse[];
  type?: string;
  date?: string;
  time?: string;
  participantType?: string;
  participantLimit?: number;
  participantCount?: number;
  groupPlayerLimit?: number;
  currentParticipants?: number;
  location?: string;
  description?: string;
  rules?: string;
  foto?: string;
  isJoined?: boolean;
}
