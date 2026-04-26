import { ClassroomDTO } from '../../dto/community/EducationDTO';

export class Classroom implements ClassroomDTO {
  id: number;
  name: string;
  facultyId?: number;

  constructor(data: ClassroomDTO) {
    this.id = data.id;
    this.name = data.name;
    this.facultyId = data.facultyId;
  }

  /**
   * Returns a friendly name (e.g., Section 101).
   */
  get displayName(): string {
    return this.name || `Sınıf ${this.id}`;
  }

  /**
   * Factory method to create a Classroom from a DTO.
   */
  static fromJSON(data: ClassroomDTO): Classroom {
    return new Classroom(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): ClassroomDTO {
    return {
      id: this.id,
      name: this.name,
      facultyId: this.facultyId
    };
  }
}
