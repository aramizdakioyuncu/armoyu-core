import { BaseService } from '../services/BaseService';
import { ArmoyuEvent, EventParticipantsDTO, ServiceResponse } from '../models';
import { EventMapper } from '../utils/mappers';

/**
 * Legacy V1 (OLD) implementation for EventService.
 */
export class EventServiceV1 extends BaseService {
  /**
   * Get all listed events with pagination (V1).
   */
  async getEvents(page: number, options?: { limit?: number, gameId?: number, status?: string }): Promise<ServiceResponse<ArmoyuEvent[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const limit = options?.limit || 20;
      formData.append('limit', limit.toString());
      if (options?.gameId) formData.append('oyunID', options.gameId.toString());
      if (options?.status) formData.append('durum', options.status);

      const response = await this.client.post<any>(`/0/0/etkinlikler/liste/${page}/`, formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.etkinlikler || []);
      const mapped = (rawList as any[]).map(item => EventMapper.mapEvent(item)).filter((n): n is ArmoyuEvent => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[EventServiceV1] Failed to fetch events:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get detailed information for a specific event (V1).
   */
  async getEventDetail(params: { eventId?: number, eventUrl?: string }): Promise<ServiceResponse<ArmoyuEvent | null>> {
    try {
      const formData = new FormData();
      if (params.eventId) formData.append('eventID', params.eventId.toString());
      if (params.eventUrl) formData.append('eventURL', params.eventUrl);

      const response = await this.client.post<any>('/0/0/etkinlikler/detay/', formData);
      const icerik = this.handle<any>(response);
      const mapped = EventMapper.mapEvent(icerik);
      return this.createSuccess(mapped || null, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV1] Failed to fetch event detail:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Join an event (V1).
   */
  async joinEvent(eventId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('eventID', eventId.toString());
      const response = await this.client.post<any>('/0/0/etkinlikler/katil/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV1] Failed to join event ${eventId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Respond to an event invitation (V1).
   */
  async respondToEvent(eventId: number, answer: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('eventID', eventId.toString());
      formData.append('cevap', answer);
      const response = await this.client.post<any>('/0/0/etkinlikler/cevap/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV1] Failed to respond to event ${eventId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get teams participating in an event (V1).
   */
  async getEventTeams(eventId: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('eventID', eventId.toString());
      const response = await this.client.post<any>('/0/0/etkinlikler/takimlar/0/', formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(Array.isArray(icerik) ? icerik : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV1] Failed to fetch event teams for ${eventId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get participants in an event (V1).
   */
  async getEventParticipants(eventId: number): Promise<ServiceResponse<EventParticipantsDTO>> {
    try {
      const formData = new FormData();
      formData.append('etkinlikID', eventId.toString());
      const response = await this.client.post<any>('/0/0/etkinlikler/katilim/0/', formData);
      const icerik = this.handle<any>(response);
      const mapped = EventMapper.mapParticipants(icerik);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventServiceV1] Failed to fetch participants for ${eventId}:`, error);
      return this.createError(error.message);
    }
  }
}
