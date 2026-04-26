import { EventDTO, EventOrganizerDTO } from '../../dto/community/EventDTO';

export class ArmoyuEvent implements EventDTO {
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

  constructor(data: EventDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.logo = data.logo;
    this.banner = data.banner;
    this.url = data.url;
    this.date = data.date;
    this.location = data.location;
    this.gameId = data.gameId;
    this.gameName = data.gameName;
    this.gameLogo = data.gameLogo;
    this.gameBanner = data.gameBanner;
    this.status = data.status;
    this.participantType = data.participantType;
    this.participantCount = data.participantCount;
    this.participantLimit = data.participantLimit;
    this.groupPlayerLimit = data.groupPlayerLimit;
    this.rules = data.rules;
    this.organizers = data.organizers;
    this.isJoined = data.isJoined;
    this.dlc = data.dlc;
    this.files = data.files;
    this.detail = data.detail;
  }

  /**
   * Factory method to create an ArmoyuEvent from a DTO.
   */
  static fromJSON(data: EventDTO): ArmoyuEvent {
    return new ArmoyuEvent(data);
  }

  /**
   * Returns a clean URL for the event page.
   */
  get eventUrl(): string {
    return `/etkinlik/${this.url || this.id}`;
  }

  /**
   * Returns true if the event is still open for joining.
   */
  get isOpen(): boolean {
    return this.status === 1 && (this.participantLimit === 0 || this.participantCount < this.participantLimit);
  }

  /**
   * Returns percentage of participation.
   */
  get participationPercentage(): number {
    if (!this.participantLimit) return 0;
    return Math.round((this.participantCount / this.participantLimit) * 100);
  }

  /**
   * Returns true if the event is a tournament.
   */
  get isTournament(): boolean {
    return this.category?.toLowerCase().includes('turnuva') || false;
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): EventDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      logo: this.logo,
      banner: this.banner,
      url: this.url,
      date: this.date,
      location: this.location,
      gameId: this.gameId,
      gameName: this.gameName,
      gameLogo: this.gameLogo,
      gameBanner: this.gameBanner,
      status: this.status,
      participantType: this.participantType,
      participantCount: this.participantCount,
      participantLimit: this.participantLimit,
      groupPlayerLimit: this.groupPlayerLimit,
      rules: this.rules,
      organizers: this.organizers,
      isJoined: this.isJoined,
      dlc: this.dlc,
      files: this.files,
      detail: this.detail
    };
  }
}
