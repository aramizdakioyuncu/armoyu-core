import { SchoolResponse, FacultyResponse, ClassroomResponse } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Education (Schools, Faculties, Classrooms) related data structures.
 * Strict mapping: Targeting exact API fields for V1.
 */
export class EducationMapper extends BaseMapper {
  /**
   * Maps raw school data.
   */
  static mapSchool(raw: any, usePreviousVersion: boolean = false): SchoolResponse | null {
    const legacy = this.shouldReturnRaw<SchoolResponse>(raw);
    if (legacy) return legacy;
    if (!raw) return null;

    return {
      id: this.toNumber(raw.ID),
      name: raw.Value,
      logo: this.toImageUrl(raw.okul_logo),
      logo_small: this.toImageUrl(raw.okul_ufaklogo),
      logo_mini: this.toImageUrl(raw.okul_minnaklogo),
      url: raw.okul_URL,
      type: raw.okultip, // No example for this, but keeping if it was correct
      website: raw.okulweb, 
      city: raw.okulsehir,
      district: raw.okulilce,
      memberCount: this.toNumber(raw.okul_uyesayisi),
      description: raw.okulaciklama
    };
  }

  /**
   * Maps raw faculty data.
   */
  static mapFaculty(raw: any, usePreviousVersion: boolean = false): FacultyResponse | null {
    if (!raw) return null;
    return {
      id: this.toNumber(raw.ID),
      name: raw.Value,
      schoolId: this.toNumber(raw.okulID)
    };
  }

  /**
   * Maps raw classroom data.
   */
  static mapClassroom(raw: any, usePreviousVersion: boolean = false): ClassroomResponse | null {
    if (!raw) return null;
    return {
      id: this.toNumber(raw.ID),
      name: raw.Value,
      facultyId: this.toNumber(raw.fakulteID)
    };
  }
}
