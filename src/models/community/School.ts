export class School {
  id?: string | number;
  name?: string;

  constructor(data?: Partial<School>) {
    Object.assign(this, data);
  }
}
