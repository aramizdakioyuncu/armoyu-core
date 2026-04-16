/**
 * Unique response interface for api.events.getEvents()
 */

export interface GetEventsOrganizer {
  player_ID: number;
  player_avatar: string;
  player_displayname: string;
}

export interface EventItem {
  event_ID: number;
  event_status: number;
  event_link: string;
  event_foto: string;
  event_fotodetail: string;
  event_name: string;
  event_gameID: number;
  event_gamename: string;
  event_gamebanner: string;
  event_gamelogo: string;
  event_organizer: GetEventsOrganizer[];
}

export interface GetEventsResponse {
  icerik: EventItem[];
  durum: number;
  aciklama: string;
  kod: number;
}
