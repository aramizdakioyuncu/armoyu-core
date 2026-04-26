import { BlockedUserResponse } from '../../user/BlockedUserResponse';

export class BlockedUser implements BlockedUserResponse {
  blockId: number;
  userId: number;
  displayName: string;
  username: string;
  avatar: string;
  blockDate: string;

  constructor(data: BlockedUserResponse) {
    this.blockId = data.blockId;
    this.userId = data.userId;
    this.displayName = data.displayName;
    this.username = data.username;
    this.avatar = data.avatar;
    this.blockDate = data.blockDate;
  }

  static fromJSON(data: BlockedUserResponse): BlockedUser {
    return new BlockedUser(data);
  }

  toJSON(): BlockedUserResponse {
    return {
      blockId: this.blockId,
      userId: this.userId,
      displayName: this.displayName,
      username: this.username,
      avatar: this.avatar,
      blockDate: this.blockDate
    };
  }

  get profileUrl(): string {
    return `/profil/${this.username}`;
  }
}
