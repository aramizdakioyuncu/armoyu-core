import { SchoolResponse, ServiceResponse, ClassroomResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { EducationMapper } from '../utils/mappers/EducationMapper';

/**
 * Service for Education and Academic institutions.
 */
export class EducationService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Get all registered schools/universities.
   */
  async getSchools(): Promise<ServiceResponse<SchoolResponse[]>> {
    try {
      // API endpoint from user's curl
      const response = await this.client.post<any>('/0/0/okullar/0/0/');
      const icerik = this.handle<any>(response);
      
      const rawList = Array.isArray(icerik) ? icerik : [];
      const mapped = rawList.map(item => EducationMapper.mapSchool(item)).filter((n): n is SchoolResponse => n !== null);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[EducationService] Failed to fetch schools:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get classrooms/sections for a specific school.
   */
  async getClassrooms(schoolId: number): Promise<ServiceResponse<ClassroomResponse[]>> {
    try {
      const formData = new FormData();
      formData.append('hangisyeri', schoolId.toString());

      const response = await this.client.post<any>('/0/0/isyerleri/icerik/0/', formData);
      const icerik = this.handle<any>(response);
      
      const rawList = Array.isArray(icerik) ? icerik : [];
      const mapped = rawList.map(item => EducationMapper.mapClassroom(item)).filter((n): n is ClassroomResponse => n !== null);
      
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EducationService] Failed to fetch classrooms for school ${schoolId}:`, error);
      return this.createError(error.message);
    }
  }
}
