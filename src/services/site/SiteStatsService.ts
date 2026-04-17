import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles site-wide statistics, session logs, and messages.
 */
export class SiteStatsService extends BaseService {
  async getStatistics(category: string = 'aktifoyuncu'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('category', category);
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/istatistik/0/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  getSessionLogs() { return this.getStatistics('oturumkayitlari'); }

  async getSiteMessages(userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) formData.append('oyuncubakid', userId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/sitemesaji/0/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getSiteMessageDetail(userId?: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      if (userId !== undefined) formData.append('oyuncubakid', userId.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/sitemesajidetay/0/0/'), formData);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
