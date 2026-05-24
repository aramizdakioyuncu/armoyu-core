import { ArmoyuEvent, EventParticipantsDTO, ServiceResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { EventServiceV1 } from '../v1/EventServiceV1';
import { EventServiceV2 } from '../v2/EventServiceV2';

/**
 * Service for managing platform events and activities.
 * Delegates requests to EventServiceV1 or EventServiceV2 based on ApiVersion.
 */
export class EventService extends BaseService {
  private version: EventServiceV1 | EventServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new EventServiceV1(client, logger)
      : new EventServiceV2(client, logger);
  }

  async getEvents(page: number, options?: { limit?: number, gameId?: number, status?: string }): Promise<ServiceResponse<ArmoyuEvent[]>> {
    return this.version.getEvents(page, options);
  }

  async getEventDetail(params: { eventId?: number, eventUrl?: string }): Promise<ServiceResponse<ArmoyuEvent | null>> {
    return this.version.getEventDetail(params);
  }

  async joinEvent(eventId: number): Promise<ServiceResponse<boolean>> {
    return this.version.joinEvent(eventId);
  }

  async respondToEvent(eventId: number, answer: string): Promise<ServiceResponse<boolean>> {
    return this.version.respondToEvent(eventId, answer);
  }

  async getEventTeams(eventId: number): Promise<ServiceResponse<any[]>> {
    return this.version.getEventTeams(eventId);
  }

  async getEventParticipants(eventId: number): Promise<ServiceResponse<EventParticipantsDTO>> {
    return this.version.getEventParticipants(eventId);
  }
}
