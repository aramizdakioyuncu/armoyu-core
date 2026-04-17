import { BaseService } from '../BaseService';
import { ServiceResponse } from '../../api/ServiceResponse';

/**
 * Handles "life" related aspects like education and invitations.
 */
export class UserLifeService extends BaseService {
  async getUserSchools(userId?: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      if (userId !== undefined) formData.append('oyuncubakid', userId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullarim/0/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getSchoolDetail(schoolId: number): Promise<ServiceResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('okulID', schoolId.toString());
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/okullar/detay/0/'), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async getInvitationsList(page: number = 1): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/davetliste/${page}/0/`), formData);
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }

  async refreshInviteCode(): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>(this.resolveBotPath('/0/0/davetkodyenile/0/'), {});
      return this.createSuccess(this.handle(response), response?.aciklama);
    } catch (error: any) {
      return this.createError(error.message);
    }
  }
}
