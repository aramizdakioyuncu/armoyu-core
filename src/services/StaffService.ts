import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { TeamMember } from '../models/auth/TeamMember';
import { StaffApplication } from '../models/auth/StaffApplication';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing platform staff, applications, and official team members (Legacy).
 * @checked 2026-04-12
 */
export class StaffService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Fetches the official team members (Legacy).
   */
  async getStaff(page: number, category?: string, limit?: number): Promise<ServiceResponse<TeamMember[]>> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (category !== undefined) {
        formData.append('category', category);
      }
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath(`/0/0/ekibimiz/${page}/${limit || 0}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StaffService] Failed to fetch staff team:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Submits an application to join the team (Legacy).
   */
  async apply(params: {
    positionId: number | string,
    whyJoin: string,
    whyPosition: string,
    timeCommitment: string
  }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('positionID', params.positionId.toString());
      formData.append('whyjoin', params.whyJoin);
      formData.append('whyposition', params.whyPosition);
      formData.append('howmachtime', params.timeCommitment);

      const url = this.resolveBotPath('/0/0/ekibimiz/katil-istek/0/');
      const response = await this.client.post<any>(url, formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StaffService] Team application submission failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of staff applications (Legacy).
   */
  async getApplications(page: number, limit?: number): Promise<ServiceResponse<StaffApplication[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath(`/0/0/ekibimiz/basvurular/${page}/`);
      const response = await this.client.post<any>(url, formData);
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error('[StaffService] Failed to fetch applications:', error);
      return this.createError(error.message);
    }
  }
}



