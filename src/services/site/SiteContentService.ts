import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles site-wide static and dynamic content pages.
 */
export class SiteContentService extends BaseService {
  async getPageContent(page: string, category: string = 'home'): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('category', category);
      const res = await this.client.post<any>(this.resolveBotPath(`/0/0/${page}/0/0/`), formData);
      const icerik = (res && Number(res.durum) === 1) ? (res.aciklamadetay || res.icerik) : this.handle(res);
      return this.createSuccess(icerik, res?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  getAboutContent(cat: string = 'home') { return this.getPageContent('hakkimizda', cat); }
  getPrivacyPolicy(cat: string = 'home') { return this.getPageContent('gizlilik-sozlesmesi', cat); }
  getTermsOfService(cat: string = 'home') { return this.getPageContent('hizmetsartlari-kullanicipolitikalari', cat); }
}
