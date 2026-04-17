import { ChatMessage } from '../models/social/chat/Message';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';

/**
 * Service for managing real-time chat and private messaging.
 * @checked 2026-04-12
 */
export class ChatService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger, usePreviousVersion: boolean = false) {
    super(client, logger, usePreviousVersion);
  }

  /**
   * Sends a chat message to a user or group (Legacy).
   */
  async sendMessage(params: { userId: number, content: string, type?: string }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', params.userId.toString());
      formData.append('icerik', params.content);
      formData.append('turu', params.type || 'ozel');

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sohbetgonder/${params.userId}/${params.type || 'ozel'}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Sending message failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the chat history with a specific user (Legacy).
   */
  async getChatHistory(page: number, params: { userId: number, limit?: number }): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', params.userId.toString());
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sohbet/${params.userId}/${page}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching chat history failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of recent chats/friends to chat with (Legacy).
   */
  async getFriendsChat(page: number, params: { limit?: number } = {}): Promise<ServiceResponse<any>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sohbet/arkadaslarim/${page}/`), formData);
      const icerik = this.handle<any>(response);
      return this.createSuccess(icerik, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching friends chat failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the detailed information/messages for a specific chat (Legacy).
   */
  async getChatDetail(params: { chatId: number, type?: string }): Promise<ServiceResponse<ChatMessage[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sohbetID', params.chatId.toString());
      formData.append('sohbetturu', params.type || 'grup');

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sohbetdetay/${params.chatId}/${params.type || 'grup'}/`), formData);
      const data = this.handle<any[]>(response);
      
      return this.createSuccess(data || [], response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching chat detail failed:`, error);
      return this.createError(error.message);
    }
  }
}



