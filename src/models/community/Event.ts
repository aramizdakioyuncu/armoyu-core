export interface EventOrganizer {
  id?: string | number;
  displayName?: string;
  avatar?: string;
}

export interface ArmoyuEvent {
  id?: string | number;
  name?: string;
  status?: number;
  link?: string;
  thumbnail?: string;
  image?: string;
  gameId?: string | number;
  gameName?: string;
  gameLogo?: string;
  gameBanner?: string;
  organizers?: EventOrganizer[];
  type?: string;
  date?: string;
  participantType?: string;
  participantLimit?: number;
  groupPlayerLimit?: number;
  currentParticipants?: number;
  location?: string;
  description?: string;
  rules?: string;
  foto?: string;
}


