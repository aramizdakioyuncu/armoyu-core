import { SchoolDTO, ClassroomDTO, FacultyDTO, School, Classroom, Faculty } from '../../../models';
import { BaseMapper } from '../BaseMapper';

/**
 * Mapper for Education (Schools, Faculties, Classrooms) related data structures.
 * Strict mapping: Targeting exact API fields for V1.
 */
export class EducationMapper extends BaseMapper {
  /**
   * Maps raw school data.
   */
  static mapSchool(raw: any, usePreviousVersion: boolean = false): School | null {
    const legacy = this.shouldReturnRaw<SchoolDTO>(raw);
    if (legacy) return new School(legacy);
    if (!raw) return null;

    return new School({
      id: this.toNumber(raw.ID),
      name: raw.Value || '',
      logo: this.toImageUrl(raw.okul_logo) || '',
      logoSmall: this.toImageUrl(raw.okul_ufaklogo),
      logoMini: this.toImageUrl(raw.okul_minnaklogo),
      url: raw.okul_URL || '',
      type: raw.okultip,
      website: raw.okulweb, 
      city: raw.okulsehir,
      district: raw.okulilce,
      memberCount: this.toNumber(raw.okul_uyesayisi),
      description: raw.okulaciklama
    });
  }

  /**
   * Maps raw faculty data.
   */
  static mapFaculty(raw: any, usePreviousVersion: boolean = false): Faculty | null {
    if (!raw) return null;
    return new Faculty({
      id: this.toNumber(raw.ID),
      name: raw.Value || '',
      schoolId: this.toNumber(raw.okulID)
    });
  }

  /**
   * Maps raw classroom data.
   */
  static mapClassroom(raw: any, usePreviousVersion: boolean = false): Classroom | null {
    if (!raw) return null;
    return new Classroom({
      id: this.toNumber(raw.ID),
      name: raw.Value || '',
      facultyId: raw.fakulteID ? this.toNumber(raw.fakulteID) : undefined
    });
  }
}
