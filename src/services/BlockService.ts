import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse, BlockedUser } from '../models';
import { BlockServiceV1 } from '../v1/BlockServiceV1';
import { BlockServiceV2 } from '../v2/BlockServiceV2';

/**
 * Service for managing user blocks and blacklists.
 * Delegates to BlockServiceV1 (legacy FormData) or BlockServiceV2 (REST JSON).
 */
export class BlockService extends BaseService {
  private version: BlockServiceV1 | BlockServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new BlockServiceV1(client, logger)
      : new BlockServiceV2(client, logger);
  }

  /**
   * Get all blocked users.
   */
  async getBlockedUsers(page: number = 1, limit?: number): Promise<ServiceResponse<BlockedUser[]>> {
    return this.version.getBlockedUsers(page, limit);
  }

  /**
   * Block a user.
   */
  async blockUser(userId: string | number): Promise<ServiceResponse<boolean>> {
    return this.version.blockUser(userId);
  }

  /**
   * Unblock a user.
   */
  async unblockUser(userId: string | number): Promise<ServiceResponse<boolean>> {
    return this.version.unblockUser(userId);
  }
}
