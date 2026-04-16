export class Group {
  id: string | number = '';
  name: string = '';
  shortName?: string;
  slug?: string;
  description?: string;
  category?: string;
  tag?: string;
  logo?: string | any;
  banner?: string | any;
  recruitment?: string;
  date?: string;
  memberCount?: number;
  isPrivate?: boolean;
  owner?: any;
  moderators?: any[];
  members?: any[];
  [key: string]: any;

  constructor(data?: Partial<Group>) {
    Object.assign(this, data);
  }
}



