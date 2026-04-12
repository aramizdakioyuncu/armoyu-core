/**
 * Represents a blocked user in the platform.
 */
export class BlockedUser {
  id: number = 0;
  blockedUserId: number = 0;
  displayName: string = '';
  avatar: string = '';
  username: string = '';
  blockDuration: string = '';

  constructor(data: Partial<BlockedUser>) {
    Object.assign(this, data);
  }

  /**
   * Instantiates a BlockedUser object from a JSON object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): BlockedUser {
    return new BlockedUser({
      id: Number(json.engel_ID || 0),
      blockedUserId: Number(json.engel_kimeID || 0),
      displayName: json.engel_kime || '',
      avatar: json.engel_avatar || '',
      username: json.engel_kadi || '',
      blockDuration: json.engel_zaman || ''
    });
  }
}
