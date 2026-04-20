export interface GiveawayResponse {
  id?: string | number;
  title?: string;
  description?: string;
  prize?: string;
  endsAt?: string;
  participantCount?: number;
  isParticipant?: boolean;
}
