import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';
import { GetMediaResponse } from '../../models/user/GetMediaResponse';
import { MediaCategory } from '../../models/social/meta/MediaEnums';

/**
 * Handles user media management (Photos, Videos, Avatar, Banner).
 */
export class UserMediaService extends BaseService {
  async getUserMedia(page: number, params: any = {}): Promise<GetMediaResponse> {
    try {
      const fd = new FormData();
      if (params.userId !== undefined) fd.append('oyuncubakid', params.userId.toString());
      fd.append('limit', (params.limit || 50).toString());
      fd.append('sayfa', page.toString());
      fd.append('kategori', params.category || 'all');
      const res = await this.client.post<any>(this.resolveBotPath(`/0/0/medya/${page}/0/`), fd);
      return { icerik: this.handle<any[]>(res) || [], durum: Number(res.durum), aciklama: res.aciklama || 'İşlem Başarılı', kod: Number(res.kod || 0) };
    } catch (error: any) {
      return { icerik: [], durum: 0, aciklama: error.message, kod: 0 };
    }
  }

  async uploadMedia(files: (File | Blob)[], category: MediaCategory | string = MediaCategory.ALL): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('media[]', f));
      fd.append('category', category);
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/medya/yukle/0/'), fd);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }

  async deleteMedia(id: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const fd = new FormData(); fd.append('medyaID', id.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/medya/sil/0/'), fd);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }

  async rotateMedia(id: number, degree: number): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const fd = new FormData(); fd.append('fotografID', id.toString()); fd.append('derece', degree.toString());
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/medya/donder/0/'), fd);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }

  async updateAvatar(image: any): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const f = Array.isArray(image) ? image[0] : image;
      if (!f) return this.createError('Dosya seçilmedi.');
      const fd = new FormData(); fd.append('resim', f);
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/avatar-guncelle/0/0/'), fd);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }

  async resetAvatar(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/avatar-varsayilan/0/0/'), {});
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }

  async updateBackground(image: any): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const f = Array.isArray(image) ? image[0] : image;
      if (!f) return this.createError('Dosya seçilmedi.');
      const fd = new FormData(); fd.append('resim', f);
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/arkaplan-guncelle/0/0/'), fd);
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }

  async resetBanner(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const res = await this.client.post<any>(this.resolveBotPath('/0/0/banner-varsayilan/0/0/'), {});
      return this.createSuccess(this.handle(res), res?.aciklama);
    } catch (error: any) { return this.createError(error.message); }
  }
}
