export class Team {
  id?: string | number;
  name?: string;
  logo?: string;
  color?: string;
  memberCount?: number;

  constructor(data?: Partial<Team>) {
    Object.assign(this, data);
  }
}
