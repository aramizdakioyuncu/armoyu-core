import { GroupMemberDTO } from '../../dto/community/GroupDTO';

export class GroupMember implements GroupMemberDTO {
  id: number;
  displayName: string;
  username: string;
  avatar?: string;
  role?: string;

  constructor(data: GroupMemberDTO) {
    this.id = data.id;
    this.displayName = data.displayName;
    this.username = data.username;
    this.avatar = data.avatar;
    this.role = data.role;
  }

  static fromJSON(data: GroupMemberDTO): GroupMember {
    return new GroupMember(data);
  }
}
