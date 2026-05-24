import { ManagementUserDTO } from '../../dto/core/ManagementDTO';

export class ManagementUser implements ManagementUserDTO {
  userNumber: string;
  username: string;
  displayName: string;
  avatar: string;
  role: string;
  registeredBy: string;
  age: number;
  lastLogin: string;
  remainingRights: number;
  isProblem: boolean;

  constructor(data: ManagementUserDTO) {
    this.userNumber = data.userNumber;
    this.username = data.username;
    this.displayName = data.displayName;
    this.avatar = data.avatar;
    this.role = data.role;
    this.registeredBy = data.registeredBy;
    this.age = data.age;
    this.lastLogin = data.lastLogin;
    this.remainingRights = data.remainingRights;
    this.isProblem = data.isProblem;
  }

  get hasRights(): boolean {
    return this.remainingRights > 0;
  }

  static fromJSON(data: ManagementUserDTO): ManagementUser {
    return new ManagementUser(data);
  }

  toJSON(): ManagementUserDTO {
    return {
      userNumber: this.userNumber,
      username: this.username,
      displayName: this.displayName,
      avatar: this.avatar,
      role: this.role,
      registeredBy: this.registeredBy,
      age: this.age,
      lastLogin: this.lastLogin,
      remainingRights: this.remainingRights,
      isProblem: this.isProblem
    };
  }
}
