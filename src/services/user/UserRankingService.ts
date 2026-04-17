import { UserMapper } from '../../utils/mappers/UserMapper';
import { BaseService } from '../BaseService';
import { GetXpRankingsResponse } from '../../models/user/GetXpRankingsResponse';
import { GetPopRankingsResponse } from '../../models/user/GetPopRankingsResponse';

/**
 * Handles user rankings and leaderboards (XP, Popularity).
 */
export class UserRankingService extends BaseService {
  async getXpRankings(page: number = 1): Promise<GetXpRankingsResponse> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/xpsiralama/${page}/0/`), formData);
      return { icerik: (this.handle<any[]>(response) || []).map(item => UserMapper.mapRankingUser(item)), kod: Number(response.kod), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı' };
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message };
    }
  }

  async getPopRankings(page: number = 1): Promise<GetPopRankingsResponse> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/popsiralama/${page}/0/`), formData);
      return { icerik: (this.handle<any[]>(response) || []).map(item => UserMapper.mapRankingUser(item)), kod: Number(response.kod), durum: Number(response.durum), aciklama: response.aciklama || 'İşlem Başarılı' };
    } catch (error: any) {
      return { icerik: [], kod: 0, durum: 0, aciklama: error.message };
    }
  }
}
