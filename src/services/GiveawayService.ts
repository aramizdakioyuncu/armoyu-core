import { BaseService } from './BaseService';
import { ServiceResponse } from '../models';

/**
 * Giveaways (Çekilişler). Yalnızca V2 API'de var.
 *
 * Endpoints:
 *   GET    /v1/giveaways           → list giveaways
 *   GET    /v1/giveaways/{id}      → giveaway detail with winners
 *   POST   /v1/giveaways/{id}/join → join
 *   DELETE /v1/giveaways/{id}/join → leave
 */
export class GiveawayService extends BaseService {
  private async call<T>(run: () => Promise<any>, failure: string): Promise<ServiceResponse<T>> {
    if (this.usePreviousVersion) return this.createError('Çekilişler yalnızca V2 API ile kullanılabilir') as ServiceResponse<T>;
    try {
      const response = await run();
      return this.createSuccess(this.handle<T>(response), response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[GiveawayService] ${failure}:`, error.message);
      return this.createError(error.message) as ServiceResponse<T>;
    }
  }

  getGiveaways() {
    return this.call<any[]>(() => this.client.get<any>('/v1/giveaways'), 'Failed to fetch giveaways');
  }

  getGiveaway(id: string) {
    return this.call<any>(() => this.client.get<any>(`/v1/giveaways/${encodeURIComponent(id)}`), `Failed to fetch giveaway ${id}`);
  }

  join(id: string) {
    this.requireAuth();
    return this.call<any>(() => this.client.post<any>(`/v1/giveaways/${encodeURIComponent(id)}/join`, {}), `Failed to join ${id}`);
  }

  leave(id: string) {
    this.requireAuth();
    return this.call<any>(() => this.client.delete<any>(`/v1/giveaways/${encodeURIComponent(id)}/join`), `Failed to leave ${id}`);
  }
}
