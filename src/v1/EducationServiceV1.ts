import { BaseService } from '../services/BaseService';
import { School, ServiceResponse, Classroom } from '../models';
import { EducationMapper } from '../utils/mappers';

/**
 * Legacy V1 (OLD) implementation for EducationService.
 */
export class EducationServiceV1 extends BaseService {
  /**
   * Get all registered schools/universities (V1).
   */
  async getSchools(): Promise<ServiceResponse<School[]>> {
    try {
      const response = await this.client.post<any>('/0/0/okullar/0/0/');
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : [];
      const mapped = rawList.map(item => EducationMapper.mapSchool(item)).filter((n): n is School => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[EducationServiceV1] Failed to fetch schools:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Get classrooms/sections for a specific school (V1).
   */
  async getClassrooms(schoolId: number, _page?: number, _limit?: number): Promise<ServiceResponse<Classroom[]>> {
    try {
      const formData = new FormData();
      formData.append('hangisyeri', schoolId.toString());

      const response = await this.client.post<any>('/0/0/isyerleri/icerik/0/', formData);
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : [];
      const mapped = rawList.map(item => EducationMapper.mapClassroom(item)).filter((n): n is Classroom => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EducationServiceV1] Failed to fetch classrooms for school ${schoolId}:`, error);
      return this.createError(error.message);
    }
  }

  async addClassroom(_schoolId: number, _params: { name: string, type: string }): Promise<ServiceResponse<Classroom>> {
    return this.createError('Sınıf ekleme V1 API tarafından desteklenmiyor.');
  }

  async updateClassroom(_classroomId: number, _params: { name?: string, type?: string }): Promise<ServiceResponse<Classroom>> {
    return this.createError('Sınıf güncelleme V1 API tarafından desteklenmiyor.');
  }

  async deleteClassroom(_classroomId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('Sınıf silme V1 API tarafından desteklenmiyor.');
  }
}
