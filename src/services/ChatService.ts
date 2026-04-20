import { ChatMessageResponse, ChatResponse } from '../models';
import { BaseService } from './BaseService';
import { ApiClient } from '../api/ApiClient';
import { ArmoyuLogger } from '../api/Logger';
import { ServiceResponse } from '../api/ServiceResponse';
import { ChatMapper } from '../utils/mappers';

/**
 * Service for managing real-time chat and private messaging.
 */
export class ChatService extends BaseService {
  constructor(client: ApiClient, logger: ArmoyuLogger) {
    super(client, logger);
  }

  /**
   * Sends a chat message to a user or group (Legacy).
   */
  async sendMessage(userId: number, content: string, type: 'ozel' | 'grup' = 'ozel'): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('icerik', content);
      formData.append('turu', type);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sohbetgonder/0/0/'), formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Sending message failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the chat history with a specific user (Legacy).
   */
  async getChatHistory(page: number, params: { userId: number, limit?: number }): Promise<ServiceResponse<ChatMessageResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', params.userId.toString());
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }

      const response = await this.client.post<any>(this.resolveBotPath(`/0/0/sohbet/${params.userId}/${page}/`), formData);
      const data = this.handle<any[]>(response);
      const mappedData = ChatMapper.mapMessageList(data || []);
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching chat history failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of friends available for chat.
   */
  async getFriends(page: number = 1, options?: { limit?: number }): Promise<ServiceResponse<ChatResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sohbet/arkadaslarim/0/'), formData);
      const data = this.handle<any>(response);
      
      const rawList = Array.isArray(data) ? data : [];
      const mappedData = ChatMapper.mapChatList(rawList);
      
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching friends chat failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of recent chats (Inbox).
   */
  async getChats(page: number = 1, options?: { userId?: number, limit?: number }): Promise<ServiceResponse<ChatResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sohbet/0/0/'), formData);
      const data = this.handle<any>(response);
      
      const rawList = Array.isArray(data) ? data : [];
      const mappedData = ChatMapper.mapChatList(rawList);
      
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching chats failed:`, error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the detailed information/messages for a specific chat (Legacy).
   */
  async getChatDetail(chatId: number, type: 'ozel' | 'grup' = 'ozel'): Promise<ServiceResponse<ChatMessageResponse[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sohbetID', chatId.toString());
      formData.append('sohbetturu', type);

      const response = await this.client.post<any>(this.resolveBotPath('/0/0/sohbetdetay/0/0/'), formData);
      const data = this.handle<any>(response);
      
      const rawList = Array.isArray(data) ? data : [];
      const mappedData = ChatMapper.mapMessageList(rawList);
      
      return this.createSuccess(mappedData, response?.aciklama);
    } catch (error: any) {
      this.logger.error(`[ChatService] Fetching chat detail failed:`, error);
      return this.createError(error.message);
    }
  }
}
