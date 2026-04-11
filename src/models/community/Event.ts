export interface EventOrganizer {
  id: number;
  displayName: string;
  avatar: string;
}

/**
 * Represents an ARMOYU platform event (tournament, meeting, etc.)
 */
export class ArmoyuEvent {
  id: number = 0;
  name: string = '';
  status: number = 0;
  link: string = '';
  thumbnail: string = '';
  image?: string;
  
  // Game details
  gameId: number = 0;
  gameName: string = '';
  gameLogo: string = '';
  gameBanner: string = '';

  // Organizer details
  organizers: EventOrganizer[] = [];

  // Event specifics
  type: string = ''; // e.g. 'bireysel', 'gruplu'
  date: string = ''; // Format: DD.MM.YYYY HH:mm
  participantType: string = ''; // e.g. 'herkes'
  participantLimit: number = 0;
  groupPlayerLimit: number = 0;
  currentParticipants: number = 0;
  
  location: string = '';
  description: string = '';
  rules: string = '';

  constructor(data: Partial<ArmoyuEvent>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates an ArmoyuEvent object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): ArmoyuEvent {
    // Map organizer list
    const organizers: EventOrganizer[] = (json.event_organizer || []).map((o: any) => ({
      id: Number(o.player_ID || 0),
      displayName: o.player_displayname || '',
      avatar: o.player_avatar || ''
    }));

    return new ArmoyuEvent({
      id: Number(json.event_ID || json.id || 0),
      name: json.event_name || json.title || '',
      status: Number(json.event_status || 0),
      link: json.event_link || '',
      thumbnail: json.event_foto || json.banner || '',
      image: json.event_fotodetail || undefined,
      
      gameId: Number(json.event_gameID || 0),
      gameName: json.event_gamename || json.game || '',
      gameLogo: json.event_gamelogo || '',
      gameBanner: json.event_gamebanner || '',

      organizers: organizers,

      type: json.event_type || '',
      date: json.event_date || json.date || '',
      participantType: json.event_participanttype || '',
      participantLimit: Number(json.event_participantlimit || 0),
      groupPlayerLimit: Number(json.event_participantgroupplayerlimit || 0),
      currentParticipants: Number(json.event_participantcurrent || 0),

      location: json.event_location || json.location || '',
      description: json.event_description || json.description || '',
      rules: json.event_rules || ''
    });
  }

  /**
   * Checks if the event has space for more participants.
   */
  hasSpace(): boolean {
    return this.participantLimit === 0 || this.currentParticipants < this.participantLimit;
  }

  /**
   * Returns a formatted progress string for participants (e.g. "12/16").
   */
  getParticipantProgress(): string {
    const limit = this.participantLimit === 0 ? "∞" : this.participantLimit;
    return `${this.currentParticipants}/${limit}`;
  }
}
