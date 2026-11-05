import { Conversation, Message, ServiceResponse, ChatType } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ChatServiceV1 } from '../v1/ChatServiceV1';
import { ChatServiceV2 } from '../v2/ChatServiceV2';

/**
 * Service for managing real-time chat and private messaging.
 * Delegates requests to ChatServiceV1 or ChatServiceV2 based on ApiVersion.
 */
export class ChatService extends BaseService {
  private version: ChatServiceV1 | ChatServiceV2;

  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
    this.version = this.usePreviousVersion
      ? new ChatServiceV1(client, logger)
      : new ChatServiceV2(client, logger);
  }

  /**
   * Sends a chat message to a user or group.
   */
  async sendMessage(userId: number | string, content: string, type: ChatType = ChatType.PRIVATE): Promise<ServiceResponse<boolean>> {
    return this.version.sendMessage(userId, content, type);
  }

  /**
   * Fetches the chat history with a specific user.
   */
  async getChatHistory(page: number, params: { userId: number | string, limit?: number }): Promise<ServiceResponse<Message[]>> {
    return this.version.getChatHistory(page, params);
  }

  /**
   * Fetches the list of friends available for chat.
   */
  async getFriendsChat(page: number = 1, options?: { limit?: number }): Promise<ServiceResponse<Conversation[]>> {
    return this.version.getFriendsChat(page, options);
  }

  /**
   * Fetches the list of recent chats (Inbox).
   */
  async getChats(page: number = 1, options?: { userId?: number, limit?: number }): Promise<ServiceResponse<Conversation[]>> {
    return this.version.getChats(page, options);
  }

  /**
   * Fetches messages for a specific chat.
   */
  async getChatDetail(chatId: number | string, type: ChatType = ChatType.PRIVATE): Promise<ServiceResponse<Message[]>> {
    return this.version.getChatDetail(chatId, type);
  }

  /**
   * Edits a previously sent message. V1 returns an unsupported error.
   */
  async editMessage(messageId: number, message: string): Promise<ServiceResponse<boolean>> {
    return this.version.editMessage(messageId, message);
  }

  /**
   * Deletes a sent message. V1 returns an unsupported error.
   */
  async deleteMessage(messageId: number): Promise<ServiceResponse<boolean>> {
    return this.version.deleteMessage(messageId);
  }
}
