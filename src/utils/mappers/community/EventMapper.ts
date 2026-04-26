import { EventDTO, EventParticipantsDTO, ArmoyuEvent } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Events related API responses.
 * Strict mapping: Targeting exact API fields for V1.
 */
export class EventMapper extends BaseMapper {
  static mapEvent(raw: any): ArmoyuEvent {
    const legacy = this.shouldReturnRaw<EventDTO>(raw);
    if (legacy) return new ArmoyuEvent(legacy);
    if (!raw) return new ArmoyuEvent({} as EventDTO);

    return new ArmoyuEvent({
      id: this.toNumber(raw.event_ID),
      name: raw.event_name || '',
      description: raw.event_description,
      category: raw.event_type,
      logo: this.toImageUrl(raw.event_foto) || '',
      banner: this.toImageUrl(raw.event_fotodetail),
      url: raw.event_link || '',
      date: raw.event_date || '',
      location: raw.event_location,
      gameId: this.toNumber(raw.event_gameID),
      gameName: raw.event_gamename || '',
      gameLogo: this.toImageUrl(raw.event_gamelogo),
      gameBanner: this.toImageUrl(raw.event_gamebanner),
      status: this.toNumber(raw.event_status),
      participantType: raw.event_participanttype,
      participantCount: this.toNumber(raw.event_participantcurrent),
      participantLimit: this.toNumber(raw.event_participantlimit),
      groupPlayerLimit: this.toNumber(raw.event_participantgroupplayerlimit),
      rules: raw.event_rules,
      organizers: Array.isArray(raw.event_organizer) ? raw.event_organizer.map((o: any) => ({
        id: this.toNumber(o.player_ID),
        displayName: o.player_displayname || '',
        avatar: this.toImageUrl(o.player_avatar) || ''
      })) : [],
      isJoined: this.toBool(raw.benkatildim || raw.event_isjoined),
      dlc: Array.isArray(raw.dlc) ? raw.dlc : [],
      files: Array.isArray(raw.files) ? raw.files : [],
      detail: Array.isArray(raw.detail) ? raw.detail : []
    });
  }

  static mapEventList(rawList: any[]): ArmoyuEvent[] {
    return (rawList || []).map(item => this.mapEvent(item));
  }

  /**
   * Maps event participants (players and groups).
   */
  static mapParticipants(raw: any): EventParticipantsDTO {
    if (!raw) return { groups: [], individuals: [] };

    const groups = Array.isArray(raw.participant_groups)
      ? raw.participant_groups.map((g: any) => ({
          id: this.toNumber(g.group_ID),
          name: g.group_name,
          shortName: g.group_shortname,
          logo: this.toImageUrl(g.group_logo),
          banner: this.toImageUrl(g.group_banner),
          url: g.group_URL,
          players: Array.isArray(g.group_players)
            ? g.group_players.map((p: any) => ({
                id: this.toNumber(p.player_ID),
                name: p.player_name || '',
                username: p.player_username || '',
                avatar: this.toImageUrl(p.player_avatar) || '',
                role: p.player_role
              }))
            : []
        }))
      : [];

    const individuals = Array.isArray(raw.participant_players)
      ? raw.participant_players.map((p: any) => ({
          id: this.toNumber(p.player_ID),
          name: p.player_name || '',
          username: p.player_username || '',
          avatar: this.toImageUrl(p.player_avatar) || ''
        }))
      : [];

    return { groups, individuals };
  }
}
