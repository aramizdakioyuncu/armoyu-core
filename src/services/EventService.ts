import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { GetEventsResponse } from '../models/community/GetEventsResponse';
import { ArmoyuEvent } from '../models/community/Event';

/**
 * Service for managing platform events, tournaments, and community gatherings.
 * @checked 2026-04-12
 */
export class EventService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches a list of events from the platform with advanced filtering.
   */
  async getEvents(page: number = 1, params: {
    gameId?: number;
    status?: string | number;
    limit?: number;
  } = {}): Promise<GetEventsResponse> {
    try {
      const formData = new FormData();
      if (params.gameId !== undefined) formData.append('oyunID', String(params.gameId));
      if (params.status !== undefined) formData.append('etkinlikdurum', String(params.status));
      formData.append('sayfa', String(page));
      if (params.limit !== undefined) formData.append('limit', String(params.limit));

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/etkinlikler/liste/${page}/`), formData);
      const icerik = this.handle<any[]>(response);
      
      return {
        icerik: icerik || [],
        durum: Number(response.durum),
        aciklama: response.aciklama || 'İşlem Başarılı',
        kod: Number(response.kod || 0)
      };
    } catch (error: any) {
      this.logger.error('[EventService] Fetching events failed:', error);
      return { icerik: [], durum: 0, aciklama: error.message, kod: 0 };
    }
  }

  /**
   * Fetches the detailed information for a specific event.
   */
  async getEventDetail(options: { eventId?: number, eventURL?: string }): Promise<ServiceResponse<ArmoyuEvent | null>> {
    try {
      const formData = new FormData();
      if (options.eventId) formData.append('eventID', String(options.eventId));
      if (options.eventURL) formData.append('eventURL', options.eventURL);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/detay/'), formData);
      const icerik = this.handle<any>(response);
      
      return this.createSuccess(icerik || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Fetching event detail failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Submits a participation request (Join/Leave) for an event.
   */
  async joinEvent(eventId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('etkinlikID', String(eventId));

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katilim/0/'), formData);
      const success = Number(response?.durum) === 1;
      
      return this.createSuccess(success, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Joining event ${eventId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Responds to an event (Confirming 'yes' or 'no').
   */
  async respondToEvent(eventId: number, answer: 'evet' | 'hayir'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('etkinlikID', String(eventId));
      formData.append('cevap', answer);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katilma/0/'), formData);
      const success = Number(response?.durum) === 1;
      
      return this.createSuccess(success, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Responding to event ${eventId} failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of teams participating in an event.
   */
  async getEventTeams(eventId: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('etkinlikID', String(eventId));

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/takimlar/0/'), formData);
      const icerik = this.handle<any[]>(response);
      
      return this.createSuccess(icerik || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Fetching teams for event ${eventId} failed:`, error);
      return this.createError(error.message);
    }
  }
}



