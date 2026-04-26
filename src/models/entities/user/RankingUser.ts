import { RankingUserResponse } from '../../user/RankingUserResponse';

export class RankingUser implements RankingUserResponse {
  rank: number;
  id: number;
  displayName: string;
  username: string;
  avatar: string;
  value: number;

  constructor(data: RankingUserResponse) {
    this.rank = data.rank;
    this.id = data.id;
    this.displayName = data.displayName;
    this.username = data.username;
    this.avatar = data.avatar;
    this.value = data.value;
  }

  static fromJSON(data: RankingUserResponse): RankingUser {
    return new RankingUser(data);
  }

  toJSON(): RankingUserResponse {
    return {
      rank: this.rank,
      id: this.id,
      displayName: this.displayName,
      username: this.username,
      avatar: this.avatar,
      value: this.value
    };
  }

  get profileUrl(): string {
    return `/profil/${this.username}`;
  }
}
