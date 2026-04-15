import { ArmoyuEvent } from '../models/community/Event';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

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
   * 
   * @param params Filtering and pagination options
   * @returns List of enriched ArmoyuEvent objects
   */
  async getEvents(params: {
    gameId?: number;
    status?: string | number;
    page?: number;
    limit?: number;
  } = {}): Promise<ArmoyuEvent[]> {
    try {
      const page = params.page || 0;
      const formData = new FormData();
      if (params.gameId !== undefined) formData.append('oyunID', String(params.gameId));
      if (params.status !== undefined) formData.append('etkinlikdurum', String(params.status));
      if (params.page !== undefined) formData.append('sayfa', String(params.page));
      if (params.limit !== undefined) formData.append('limit', String(params.limit));

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/etkinlikler/liste/${page}/`), formData);
      const icerik = this.handleResponse<any[]>(response);
      
      return Array.isArray(icerik) ? icerik.map(item => ArmoyuEvent.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[EventService] Fetching events failed:', error);
      return [];
    }
  }

  /**
   * Fetches the detailed information for a specific event.
   * 
   * @param options Identification for the event (id or slug/url)
   * @returns Enriched ArmoyuEvent object or null
   */
  async getEventDetail(options: { eventId?: number, eventURL?: string }): Promise<ArmoyuEvent | null> {
    try {
      const formData = new FormData();
      if (options.eventId) formData.append('eventID', String(options.eventId));
      if (options.eventURL) formData.append('eventURL', options.eventURL);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/detay/'), formData);
      const icerik = this.handleResponse<any>(response);
      
      return icerik ? ArmoyuEvent.fromJSON(icerik) : null;
    } catch (error) {
      this.logger.error(`[EventService] Fetching event detail failed:`, error);
      return null;
    }
  }

  /**
   * Submits a participation request (Join/Leave) for an event.
   * 
   * @param eventId The ID of the event
   * @returns Success status
   */
  async joinEvent(eventId: number): Promise<boolean> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('etkinlikID', String(eventId));

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katilim/0/'), formData);
      
      // If the response is success (durum 1), return true
      return Number(response?.durum) === 1;
    } catch (error) {
      this.logger.error(`[EventService] Joining event ${eventId} failed:`, error);
      return false;
    }
  }

  /**
   * Responds to an event (Confirming 'yes' or 'no').
   * 
   * @param eventId The ID of the event
   * @param answer The response ('evet' or 'hayir')
   * @returns Success status
   */
  async respondToEvent(eventId: number, answer: 'evet' | 'hayir'): Promise<boolean> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('etkinlikID', String(eventId));
      formData.append('cevap', answer);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katilma/0/'), formData);
      
      return Number(response?.durum) === 1;
    } catch (error) {
      this.logger.error(`[EventService] Responding to event ${eventId} failed:`, error);
      return false;
    }
  }

  /**
   * Fetches the list of teams participating in an event.
   * 
   * @param eventId The ID of the event
   * @returns List of enriched Team objects
   */
  async getEventTeams(eventId: number): Promise<any[]> {
    try {
      const formData = new FormData();
      formData.append('etkinlikID', String(eventId));

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/takimlar/0/'), formData);
      const icerik = this.handleResponse<any[]>(response);
      
      // We'll dynamic import the Team model to avoid circular dependency if it occurs, 
      // but for now since it's a separate file it should be fine.
      const { Team } = await import('../models/community/Team');
      return Array.isArray(icerik) ? icerik.map(item => Team.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error(`[EventService] Fetching teams for event ${eventId} failed:`, error);
      return [];
    }
  }
}
