import { BaseModel } from '../BaseModel';

/**
 * Represents an entity that organizes an event.
 */
export class EventOrganizer extends BaseModel {
  id: number = 0;
  displayName: string = '';
  avatar: string = '';

  constructor(data: Partial<EventOrganizer>) {
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates an EventOrganizer object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): EventOrganizer {
    if (BaseModel.usePreviousApi) {
      return EventOrganizer.legacyFromJSON(json);
    }
    return EventOrganizer.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): EventOrganizer {
    return new EventOrganizer({
      id: Number(json.player_ID || 0),
      displayName: json.player_displayname || '',
      avatar: json.player_avatar || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): EventOrganizer {
    return new EventOrganizer({});
  }
}

/**
 * Represents an ARMOYU platform event (tournament, meeting, etc.)
 */
export class ArmoyuEvent extends BaseModel {
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
    super();
    Object.assign(this, data);
  }

  /**
   * Instantiates an ArmoyuEvent object from a JSON object based on the API version.
   */
  static fromJSON(json: Record<string, any>): ArmoyuEvent {
    if (BaseModel.usePreviousApi) {
      return ArmoyuEvent.legacyFromJSON(json);
    }
    return ArmoyuEvent.v2FromJSON(json);
  }

  /**
   * Legacy ARMOYU v0/v1 style mapping.
   */
  private static legacyFromJSON(json: Record<string, any>): ArmoyuEvent {
    // Map organizer list
    const organizers: EventOrganizer[] = (json.event_organizer || []).map((o: any) => EventOrganizer.fromJSON(o));

    return new ArmoyuEvent({
      id: Number(json.event_ID || json.etkinlikID || json.id || 0),
      name: json.event_name || json.etkinlikadi || json.baslik || json.title || '',
      status: Number(json.event_status || json.durum || 0),
      link: json.event_link || json.url || '',
      thumbnail: json.event_foto || json.etkinlikresimi || json.resimurl || json.banner || '',
      image: json.event_fotodetail || json.resimurldetay || undefined,
      
      gameId: Number(json.event_gameID || json.oyunID || 0),
      gameName: json.event_gamename || json.oyunadi || json.game || '',
      gameLogo: json.event_gamelogo || json.oyunlogo || '',
      gameBanner: json.event_gamebanner || json.oyunbanner || '',

      organizers: organizers,

      type: json.event_type || json.etkinlikturu || '',
      date: json.event_date || json.etkinlikzaman || json.baslangiczaman || json.date || '',
      participantType: json.event_participanttype || json.katilimturu || '',
      participantLimit: Number(json.event_participantlimit || json.kontenjan || 0),
      groupPlayerLimit: Number(json.event_participantgroupplayerlimit || 0),
      currentParticipants: Number(json.event_participantcurrent || json.katilimcisayisi || 0),

      location: json.event_location || json.konum || json.location || '',
      description: json.event_description || json.aciklama || json.icerik || json.description || '',
      rules: json.event_rules || json.kurallar || ''
    });
  }

  /**
   * Standardized ARMOYU v2 style mapping.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static v2FromJSON(json: Record<string, any>): ArmoyuEvent {
    return new ArmoyuEvent({});
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
