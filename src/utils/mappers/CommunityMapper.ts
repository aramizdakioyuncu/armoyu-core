import { ArmoyuEvent } from '../../models/community/Event';
import { SearchResult } from '../../models/social/search/SearchResult';
import { BaseMapper } from './BaseMapper';

/**
 * Mapper for Community related data structures (Events, Search).
 */
export class CommunityMapper extends BaseMapper {
  /**
   * Maps raw event data to the ArmoyuEvent interface.
   * Maintains backward compatibility.
   */
  static mapEvent(raw: any, usePreviousVersion: boolean = false): ArmoyuEvent {
    const legacy = this.shouldReturnRaw<ArmoyuEvent>(raw, usePreviousVersion);
    if (legacy) return legacy;
    if (!raw) return {} as ArmoyuEvent;

    return {
      ...this.mapEventIdentity(raw),
      ...this.mapEventStats(raw),
      location: raw.event_location || raw.location,
      status: raw.event_status || raw.status,
      foto: raw.event_foto || raw.foto,
      gameName: raw.event_gamename || raw.game_name || raw.gameName
    };
  }

  /**
   * Modern v2 mapping for Event.
   */
  static mapEventV2(raw: any): ArmoyuEvent {
    return this.mapEvent(raw, false);
  }

  /**
   * Atomic: Maps event identity.
   */
  static mapEventIdentity(raw: any) {
    return {
      id: this.toNumber(raw.event_ID || raw.id),
      name: raw.event_name || raw.name,
      description: raw.event_description || raw.description,
      date: raw.event_date || raw.date
    };
  }

  /**
   * Atomic: Maps event statistics.
   */
  static mapEventStats(raw: any) {
    return {
      participantLimit: this.toNumber(raw.event_participantlimit || raw.participantLimit),
      currentParticipants: this.toNumber(raw.event_participantcurrent || raw.currentParticipants)
    };
  }

  /**
   * Maps raw search result data to the SearchResult interface.
   * Maintains backward compatibility.
   */
  static mapSearchResult(raw: any, usePreviousVersion: boolean = false): SearchResult {
    const legacy = this.shouldReturnRaw<SearchResult>(raw, usePreviousVersion);
    if (legacy) return legacy;
    if (!raw) return {} as SearchResult;

    return {
      id: this.toNumber(raw.ID || raw.id),
      type: raw.turu || raw.type,
      title: raw.Value || raw.title,
      image: raw.avatar || raw.image
    };
  }

  /**
   * Modern v2 mapping for SearchResult.
   */
  static mapSearchResultV2(raw: any): SearchResult {
    return this.mapSearchResult(raw, false);
  }
}
