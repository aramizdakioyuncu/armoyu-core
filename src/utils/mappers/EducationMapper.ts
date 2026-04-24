import { SchoolResponse } from '../../models/community/SchoolResponse';
import { ClassroomResponse } from '../../models/community/ClassroomResponse';

/**
 * Mapper for Education and School related data.
 */
export class EducationMapper {
  /**
   * Maps a raw API school item to a SchoolResponse object.
   */
  static mapSchool(json: any): SchoolResponse | null {
    if (!json) return null;

    return {
      id: Number(json.ID || 0),
      name: String(json.Value || ''),
      url: String(json.okul_URL || ''),
      logo: String(json.okul_logo || ''),
      logoSmall: String(json.okul_ufaklogo || ''),
      logoTiny: String(json.okul_minnaklogo || ''),
      memberCount: Number(json.okul_uyesayisi || 0)
    };
  }

  /**
   * Maps a raw API classroom item to a ClassroomResponse object.
   */
  static mapClassroom(json: any): ClassroomResponse | null {
    if (!json) return null;

    return {
      id: Number(json.ID || 0),
      name: String(json.Value || '')
    };
  }
}
