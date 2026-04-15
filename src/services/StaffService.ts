import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { TeamMember } from '../models/auth/TeamMember';
import { StaffApplication } from '../models/auth/StaffApplication';

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
   * 
   * @param page The page number (sayfa) - MANDATORY
   * @param category Optional staff category (e.g. 'okul-temsilcileri')
   * @param limit Results limit
   * @returns List of staff members
   */
  async getStaff(page: number, category?: string, limit?: number): Promise<TeamMember[]> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (category !== undefined) {
        formData.append('category', category);
      }
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath('/0/0/ekibimiz/0/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => TeamMember.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[StaffService] Failed to fetch staff team:', error);
      return [];
    }
  }

  /**
   * Submits an application to join the team (Legacy).
   * 
   * @param params Application details (positionId, whyJoin, whyPosition, timeCommitment)
   */
  async apply(params: {
    positionId: number | string,
    whyJoin: string,
    whyPosition: string,
    timeCommitment: string
  }): Promise<any> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('positionID', params.positionId.toString());
      formData.append('whyjoin', params.whyJoin);
      formData.append('whyposition', params.whyPosition);
      formData.append('howmachtime', params.timeCommitment);

      const url = this.resolveBotPath('/0/0/ekibimiz/katil-istek/0/');
      const response = await this.client.post<any>(url, formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error('[StaffService] Team application submission failed:', error);
      return null;
    }
  }

  /**
   * Fetches the list of staff applications (Legacy).
   * 
   * @param page The page number (sayfa) - MANDATORY
   * @param limit Results limit
   * @returns List of applications
   */
  async getApplications(page: number, limit?: number): Promise<StaffApplication[]> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (limit !== undefined) {
        formData.append('limit', limit.toString());
      }

      const url = this.resolveBotPath('/0/0/ekibimiz/basvurular/0/');
      const response = await this.client.post<any>(url, formData);
      const data = this.handleResponse<any[]>(response);
      
      return Array.isArray(data) ? data.map(item => StaffApplication.fromJSON(item)) : [];
    } catch (error) {
      this.logger.error('[StaffService] Failed to fetch applications:', error);
      return [];
    }
  }
}
