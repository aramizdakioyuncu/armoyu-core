import { BaseService } from '../services/BaseService';
import { ArmoyuEvent, EventParticipantsDTO, ServiceResponse } from '../models';
import { EventMapper } from '../utils/mappers';
import { EventMapperV2 } from '../utils/mappersv2/EventMapperV2';

/**
 * Modern V2 (CURRENT) implementation for EventService.
 * V2 uses the same field names as V1 (event_ID, event_name, etc.),
 * so EventMapper works for both versions.
 *
 * Endpoints:
 *   GET  /v1/events                        → list events
 *   GET  /v1/events/{id}                   → event detail by ID
 *   GET  /v1/events/url/{url}              → event detail by URL slug
 *   POST /v1/events/{id}/join              → join event
 *   POST /v1/events/{id}/respond           → respond to event
 *   GET  /v1/events/{id}/teams             → event teams
 *   GET  /v1/events/{id}/participants      → event participants
 */
export class EventServiceV2 extends BaseService {
  async getEvents(page: number, options?: { limit?: number, gameId?: number, status?: string }): Promise<ServiceResponse<ArmoyuEvent[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());
      if (options?.gameId) query.set('game_id', options.gameId.toString());
      if (options?.status) query.set('status', options.status);

      const response = await this.client.get<any>(`/v1/events?${query}`);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.etkinlikler || []);
      const mapped = (rawList as any[]).map(item => EventMapper.mapEvent(item)).filter((n): n is ArmoyuEvent => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[EventServiceV2] Failed to fetch events:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Fetch event detail by ID or URL slug.
   * eventId   → GET /v1/events/{id}
   * eventUrl  → GET /v1/events/url/{url}
   */
  async getEventDetail(params: { eventId?: number, eventUrl?: string }): Promise<ServiceResponse<ArmoyuEvent | null>> {
    try {
      const endpoint = params.eventUrl
        ? `/v1/events/url/${params.eventUrl}`
        : `/v1/events/${params.eventId}`;

      const response = await this.client.get<any>(endpoint);
      const icerik = this.handle<any>(response);
      const mapped = EventMapper.mapEvent(icerik);
      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV2] Failed to fetch event detail:`, error.message);
      return this.createError(error.message);
    }
  }

  async joinEvent(eventId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/events/${eventId}/join`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV2] Failed to join event ${eventId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async respondToEvent(eventId: number, answer: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(`/v1/events/${eventId}/respond`, { cevap: answer });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV2] Failed to respond to event ${eventId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getEventTeams(eventId: number): Promise<ServiceResponse<any[]>> {
    try {
      const response = await this.client.get<any>(`/v1/events/${eventId}/teams`);
      const icerik = this.handle<any>(response);
      const mapped = EventMapperV2.mapTeams(Array.isArray(icerik) ? icerik : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV2] Failed to fetch event teams for ${eventId}:`, error.message);
      return this.createError(error.message);
    }
  }

  async getEventParticipants(eventId: number): Promise<ServiceResponse<EventParticipantsDTO>> {
    try {
      const response = await this.client.get<any>(`/v1/events/${eventId}/participants`);
      const icerik = this.handle<any>(response);
      const mapped = EventMapperV2.mapParticipants(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV2] Failed to fetch participants for ${eventId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
