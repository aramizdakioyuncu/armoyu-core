import { Classroom, ClassroomDTO } from '../../models';
import { BaseMapper } from '../mappers/BaseMapper';

/**
 * Mapper for Education V2 REST API responses.
 * V2 uses isyiid/isyiadi fields instead of ID/Value.
 */
export class EducationMapperV2 extends BaseMapper {
  static mapClassroom(raw: any): Classroom | null {
    if (!raw) return null;
    return new Classroom({
      id: this.toNumber(raw.isyiid),
      name: raw.isyiadi || '',
      facultyId: raw.isyihangisi ? this.toNumber(raw.isyihangisi) : undefined
    } as ClassroomDTO);
  }

  static mapClassroomList(rawList: any[]): Classroom[] {
    return (rawList || []).map(item => this.mapClassroom(item)).filter((n): n is Classroom => n !== null);
  }
}
