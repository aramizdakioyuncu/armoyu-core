import { School, ServiceResponse, Classroom } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { EducationServiceV1 } from '../v1/EducationServiceV1';
import { EducationServiceV2 } from '../v2/EducationServiceV2';

/**
 * Service for Education and Academic institutions.
 * Delegates requests to EducationServiceV1 or EducationServiceV2 based on ApiVersion.
 */
export class EducationService extends BaseService {
  private version: EducationServiceV1 | EducationServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new EducationServiceV1(client, logger)
      : new EducationServiceV2(client, logger);
  }

  /**
   * Get all registered schools/universities.
   */
  async getSchools(): Promise<ServiceResponse<School[]>> {
    return this.version.getSchools();
  }

  /**
   * Get classrooms/sections for a specific school.
   * V2 supports optional pagination.
   */
  async getClassrooms(schoolId: number, page: number = 1, limit?: number): Promise<ServiceResponse<Classroom[]>> {
    return this.version.getClassrooms(schoolId, page, limit);
  }

  /**
   * Add a classroom to a school. V1 returns an unsupported error.
   */
  async addClassroom(schoolId: number, params: { name: string, type: string }): Promise<ServiceResponse<Classroom>> {
    return this.version.addClassroom(schoolId, params);
  }

  /**
   * Update a classroom. V1 returns an unsupported error.
   */
  async updateClassroom(classroomId: number, params: { name?: string, type?: string }): Promise<ServiceResponse<Classroom>> {
    return this.version.updateClassroom(classroomId, params);
  }

  /**
   * Delete a classroom. V1 returns an unsupported error.
   */
  async deleteClassroom(classroomId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteClassroom(classroomId);
  }
}
