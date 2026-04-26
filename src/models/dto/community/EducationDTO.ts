export interface SchoolDTO {
  id: number;
  name: string;
  logo: string;
  logoSmall?: string;
  logoMini?: string;
  url: string;
  type?: string;
  website?: string;
  city?: string;
  district?: string;
  memberCount: number;
  description?: string;
}

export interface ClassroomDTO {
  id: number;
  name: string;
  facultyId?: number;
}

export interface FacultyDTO {
  id: number;
  name: string;
  schoolId: number;
}
