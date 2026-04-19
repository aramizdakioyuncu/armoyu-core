import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles user rankings and leaderboards (XP, Popularity).
 */
export class UserRankingService extends BaseService {
  async getXpRankings(page: number = 1): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/xpsiralama/${page}/0/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama || 'İşlem Başarılı');
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getPopRankings(page: number = 1): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/popsiralama/${page}/0/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama || 'İşlem Başarılı');
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
