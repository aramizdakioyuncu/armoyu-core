import { BaseService } from '../services/BaseService';
import { School, ServiceResponse, Classroom } from '../models';
import { EducationMapper } from '../utils/mappers';
import { EducationMapperV2 } from '../utils/mappersv2/EducationMapperV2';

/**
 * Modern V2 (CURRENT) implementation for EducationService.
 *
 * Endpoints:
 *   GET    /v1/education/schools                       → list all schools
 *   GET    /v1/workplaces/{schoolId}/content           → list classrooms of a school
 *   POST   /v1/workplaces/{schoolId}/content           → add a classroom
 *   PUT    /v1/workplaces/content/{classroomId}        → update a classroom
 *   DELETE /v1/workplaces/content/{classroomId}        → delete a classroom
 */
export class EducationServiceV2 extends BaseService {
  /**
   * Get all registered schools/universities (V2).
   */
  async getSchools(): Promise<ServiceResponse<School[]>> {
    try {
      const response = await this.client.get<any>('/v1/education/schools');
      const icerik = this.handle<any>(response);
      const rawList = Array.isArray(icerik) ? icerik : [];
      const mapped = rawList.map(item => EducationMapper.mapSchool(item)).filter((n): n is School => n !== null);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[EducationServiceV2] Failed to fetch schools:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Get classrooms/sections for a specific school (V2).
   * GET /v1/workplaces/{schoolId}/content?page={page}&limit={limit}
   */
  async getClassrooms(schoolId: number, page: number = 1, limit?: number): Promise<ServiceResponse<Classroom[]>> {
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (limit) query.set('limit', limit.toString());

      const response = await this.client.get<any>(`/v1/workplaces/${schoolId}/content?${query}`);
      const icerik = this.handle<any>(response);
      const mapped = EducationMapperV2.mapClassroomList(Array.isArray(icerik) ? icerik : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EducationServiceV2] Failed to fetch classrooms for school ${schoolId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Add a classroom to a school (V2).
   * POST /v1/workplaces/{schoolId}/content
   */
  async addClassroom(schoolId: number, params: { name: string, type: string }): Promise<ServiceResponse<Classroom>> {
    try {
      const response = await this.client.post<any>(`/v1/workplaces/${schoolId}/content`, {
        name: params.name,
        type: params.type
      });
      const icerik = this.handle<any>(response);
      const mapped = EducationMapperV2.mapClassroom(icerik);
      if (!mapped) throw new Error('Sınıf verisi alınamadı.');
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EducationServiceV2] Failed to add classroom to school ${schoolId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Update a classroom (V2).
   * PUT /v1/workplaces/content/{classroomId}
   */
  async updateClassroom(classroomId: number, params: { name?: string, type?: string }): Promise<ServiceResponse<Classroom>> {
    try {
      const response = await this.client.put<any>(`/v1/workplaces/content/${classroomId}`, params);
      const icerik = this.handle<any>(response);
      const mapped = EducationMapperV2.mapClassroom(icerik);
      if (!mapped) throw new Error('Sınıf verisi alınamadı.');
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EducationServiceV2] Failed to update classroom ${classroomId}:`, error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Delete a classroom (V2).
   * DELETE /v1/workplaces/content/{classroomId}
   */
  async deleteClassroom(classroomId: number): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.client.delete<any>(`/v1/workplaces/content/${classroomId}`);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[EducationServiceV2] Failed to delete classroom ${classroomId}:`, error.message);
      return this.createError(error.message);
    }
  }
}
