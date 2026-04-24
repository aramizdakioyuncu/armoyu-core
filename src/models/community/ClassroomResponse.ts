/**
 * Represents a Classroom or Section within a school.
 */
export interface ClassroomResponse {
  id: number;
  name: string;
  facultyId?: number;
}
