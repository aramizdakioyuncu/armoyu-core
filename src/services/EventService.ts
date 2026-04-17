import { CommunityMapper } from '../utils/mappers/CommunityMapper';
import { BaseService } from './BaseService';
import { ServiceResponse } from '../api/ServiceResponse';
import { GetEventsResponse } from '../models/community/GetEventsResponse';
import { ArmoyuEvent } from '../models/community/Event';

/**
 * Service for managing platform events and community gatherings.
 */
export class EventService extends BaseService {
  async getEvents(page: number = 1, params: any = {}): Promise<GetEventsResponse> {
    try {
      const fd = new FormData();
      if (params.gameId) fd.append('oyunID', String(params.gameId));
      if (params.status) fd.append('etkinlikdurum', String(params.status));
      fd.append('sayfa', String(page));
      if (params.limit) fd.append('limit', String(params.limit));

      const res = await this.client.post<any>(this.resolveBotPath(`/0/0/etkinlikler/liste/${page}/`), fd);
      const mapped = (this.handle<any[]>(res) || []).map(i => CommunityMapper.mapEvent(i, this.usePreviousVersion));
      return { icerik: mapped, durum: Number(res.durum), aciklama: res.aciklama || 'İşlem Başarılı', kod: Number(res.kod || 0) };
    } catch (error: any) {
      return { icerik: [], durum: 0, aciklama: error.message, kod: 0 };
    }
  }

  async getEventDetail(opt: { eventId?: number, eventURL?: string }): Promise<ServiceResponse<ArmoyuEvent | null>> {
    try {
      const fd = new FormData();
      if (opt.eventId) fd.append('eventID', String(opt.eventId));
      if (opt.eventURL) fd.append('eventURL', opt.eventURL);

      const res = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/detay/'), fd);
      const mapped = CommunityMapper.mapEvent(this.handle(res), this.usePreviousVersion);
      return this.createSuccess(mapped || null, res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async joinEvent(eventId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const fd = new FormData(); fd.append('etkinlikID', String(eventId));
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katilim/0/'), fd);
      return this.createSuccess(Number(res?.durum) === 1, res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async respondToEvent(eventId: number, answer: 'evet' | 'hayir'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const fd = new FormData();
      fd.append('etkinlikID', String(eventId));
      fd.append('cevap', answer);
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/katilma/0/'), fd);
      return this.createSuccess(Number(res?.durum) === 1, res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getEventTeams(eventId: number): Promise<ServiceResponse<any[]>> {
    try {
      const fd = new FormData(); fd.append('etkinlikID', String(eventId));
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/etkinlikler/takimlar/0/'), fd);
      return this.createSuccess(this.handle<any[]>(res) || [], res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
