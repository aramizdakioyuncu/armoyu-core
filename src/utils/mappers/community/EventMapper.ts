import { EventResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Events related API responses.
 * Strict mapping: Targeting exact API fields for V1.
 */
export class EventMapper extends BaseMapper {
  static mapEvent(raw: any): EventResponse {
    const legacy = this.shouldReturnRaw<EventResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return {} as EventResponse;

    return {
      id: this.toNumber(raw.event_ID),
      name: raw.event_name,
      title: raw.event_name,
      description: raw.event_description,
      category: raw.event_type,
      logo: this.toImageUrl(raw.event_foto),
      banner: this.toImageUrl(raw.event_fotodetail),
      url: raw.event_link,
      link: raw.event_link,
      date: raw.event_date,
      location: raw.event_location,
      gameId: this.toNumber(raw.event_gameID),
      gameName: raw.event_gamename,
      gameLogo: this.toImageUrl(raw.event_gamelogo),
      gameBanner: this.toImageUrl(raw.event_gamebanner),
      status: this.toNumber(raw.event_status),
      participantCount: this.toNumber(raw.event_participantcurrent),
      currentParticipants: this.toNumber(raw.event_participantcurrent),
      participantLimit: this.toNumber(raw.event_participantlimit),
      groupPlayerLimit: this.toNumber(raw.event_participantgroupplayerlimit),
      rules: raw.event_rules,
      organizers: Array.isArray(raw.event_organizer) ? raw.event_organizer.map((o: any) => ({
        id: this.toNumber(o.player_ID),
        displayName: o.player_displayname,
        avatar: this.toImageUrl(o.player_avatar)
      })) : [],
      isJoined: this.toBool(raw.benkatildim || raw.event_isjoined)
    };
  }

  static mapEventList(rawList: any[]): EventResponse[] {
    return (rawList || []).map(item => this.mapEvent(item));
  }
}
