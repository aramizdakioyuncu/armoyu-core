import { EventResponse, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { EventMapper } from '../utils/mappers';

/**
 * Service for managing platform events and activities.
 */
export class EventService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all listed events with pagination.
   */
  async getEvents(page: number, options?: { limit?: number, gameId?: number, status?: string }): Promise<ServiceResponse<EventResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const limit = options?.limit || 20;
      formData.append('limit', limit.toString());
      if (options?.gameId) formData.append('oyunID', options.gameId.toString());
      if (options?.status) formData.append('durum', options.status);

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/etkinlikler/liste/${page}/`), formData);
      const icerik = this.handle<any>(response);
      
      const rawList = Array.isArray(icerik) ? icerik : (icerik?.liste || icerik?.etkinlikler || []);
      const mapped = (rawList as any[]).map(item => EventMapper.mapEvent(item)).filter((n): n is EventResponse => n !== null);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[EventService] Failed to fetch events:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get detailed information for a specific event.
   */
  async getEventDetail(params: { eventId?: number }): Promise<ServiceResponse<any>> {
    try {
      if (!params.eventId) {
        throw new Error('Event ID is required');
      }
      const formData = new FormData();
      formData.append('eventID', params.eventId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikbak/0/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Failed to fetch event details for ${params.eventId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Join an event.
   */
  async joinEvent(eventId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('eventID', eventId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katil/0/'), formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Failed to join event ${eventId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Respond to an event invitation or status update.
   */
  async respondToEvent(eventId: number, response: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('eventID', eventId.toString());
      formData.append('cevap', response);
      const apiResponse = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/cevap/0/'), formData);
      this.handle(apiResponse);
      return this.createSuccess(true, apiResponse?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Failed to respond to event ${eventId}:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Get teams participating in an event.
   */
  async getEventTeams(eventId: number): Promise<ServiceResponse<any[]>> {
    try {
      const formData = new FormData();
      formData.append('eventID', eventId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/takimlar/0/'), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(Array.isArray(icerik) ? icerik : [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EventService] Failed to fetch event teams for ${eventId}:`, error);
      return this.createError(error.message);
    }
  }
}
