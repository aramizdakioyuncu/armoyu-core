import { FacultyDTO } from '../../dto/community/EducationDTO';

export class Faculty implements FacultyDTO {
  id: number;
  name: string;
  schoolId: number;

  constructor(data: FacultyDTO) {
    this.id = data.id;
    this.name = data.name;
    this.schoolId = data.schoolId;
  }

  /**
   * Factory method to create a Faculty from a DTO.
   */
  static fromJSON(data: FacultyDTO): Faculty {
    return new Faculty(data);
  }

  /**
   * Converts the entity back to a DTO for API submission.
   */
  toJSON(): FacultyDTO {
    return {
      id: this.id,
      name: this.name,
      schoolId: this.schoolId
    };
  }
}
