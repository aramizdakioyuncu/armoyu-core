import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';

/**
 * Service for managing real-time chat and private messaging.
 * @checked 2026-04-12
 */
export class ChatService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Sends a chat message to a user or group (Legacy).
   * 
   * @param params Message parameters
   */
  async sendMessage(params: { userId: number, content: string, type?: string }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', params.userId.toString());
      formData.append('icerik', params.content);
      formData.append('turu', params.type || 'ozel');

      const response = await this.client.post<any>(this.resolveBotPath('/0/sohbetgonder/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[ChatService] Sending message failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the chat history with a specific user (Legacy).
   * 
   * @param page The page number - MANDATORY
   * @param params Query and pagination parameters (userId, limit)
   */
  async getChatHistory(page: number, params: { userId: number, limit?: number }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', params.userId.toString());
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/sohbet/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[ChatService] Fetching chat history failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the list of recent chats/friends to chat with (Legacy).
   * 
   * @param page The page number - MANDATORY
   * @param params Pagination parameters (limit)
   */
  async getFriendsChat(page: number, params: { limit?: number } = {}): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath('/0/sohbet/arkadaslarim/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[ChatService] Fetching friends chat failed:`, error);
      return null;
    }
  }

  /**
   * Fetches the detailed information/messages for a specific chat (Legacy).
   * 
   * @param params Chat identification
   */
  async getChatDetail(params: { chatId: number, type?: string }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('sohbetID', params.chatId.toString());
      formData.append('sohbetturu', params.type || 'grup');

      const response = await this.client.post<any>(this.resolveBotPath('/0/sohbetdetay/0/0/'), formData);
      return this.handleResponse<any>(response);
    } catch (error) {
      this.logger.error(`[ChatService] Fetching chat detail failed:`, error);
      return null;
    }
  }
}
