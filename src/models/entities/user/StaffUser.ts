import { StaffUserResponse } from '../../staff/StaffUserResponse';

export class StaffUser implements StaffUserResponse {
  displayName: string;
  username: string;
  role: string;
  avatar: string;

  constructor(data: StaffUserResponse) {
    this.displayName = data.displayName;
    this.username = data.username;
    this.role = data.role;
    this.avatar = data.avatar;
  }

  static fromJSON(data: StaffUserResponse): StaffUser {
    return new StaffUser(data);
  }

  toJSON(): StaffUserResponse {
    return {
      displayName: this.displayName,
      username: this.username,
      role: this.role,
      avatar: this.avatar
    };
  }

  get profileUrl(): string {
    return `/profil/${this.username}`;
  }
}
