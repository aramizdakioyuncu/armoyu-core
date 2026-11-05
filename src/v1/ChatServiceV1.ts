import { BaseService } from '../services/BaseService';
import { Conversation, Message, ServiceResponse, ChatType } from '../models';
import { ChatMapper } from '../utils/mappers';

/**
 * Legacy V1 (OLD) implementation for ChatService.
 */
export class ChatServiceV1 extends BaseService {
  /**
   * Sends a chat message to a user or group (V1).
   */
  async sendMessage(userId: number | string, content: string, type: ChatType = ChatType.PRIVATE): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', userId.toString());
      formData.append('icerik', content);
      formData.append('turu', type);

      const response = await this.client.post<any>('/0/0/sohbetgonder/0/0/', formData);
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV1] Sending message failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the chat history with a specific user (V1).
   */
  async getChatHistory(page: number, params: { userId: number | string, limit?: number }): Promise<ServiceResponse<Message[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('oyuncubakid', params.userId.toString());
      formData.append('sayfa', page.toString());
      if (params.limit !== undefined) {
        formData.append('limit', params.limit.toString());
      }

      const response = await this.client.post<any>(`/0/0/sohbet/${params.userId}/${page}/`, formData);
      const data = this.handle<any[]>(response);
      const mappedData = ChatMapper.mapHistoryList(data || []);
      return this.createSuccess(mappedData, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[ChatServiceV1] Fetching chat history failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of friends available for chat (V1).
   */
  async getFriendsChat(page: number = 1, options?: { limit?: number }): Promise<ServiceResponse<Conversation[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());

      const response = await this.client.post<any>('/0/0/sohbet/arkadaslarim/0/', formData);
      const data = this.handle<any>(response);
      const mapped = ChatMapper.mapFriendList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[ChatServiceV1] Fetching friends chat failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of recent chats / inbox (V1).
   */
  async getChats(page: number = 1, options?: { userId?: number, limit?: number }): Promise<ServiceResponse<Conversation[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sayfa', page.toString());
      if (options?.limit) formData.append('limit', options.limit.toString());
      if (options?.userId) formData.append('oyuncubakid', options.userId.toString());

      const response = await this.client.post<any>('/0/0/sohbet/0/0/', formData);
      const data = this.handle<any>(response);
      const mapped = ChatMapper.mapInboxList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[ChatServiceV1] Fetching chats failed:', error);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches messages for a specific chat (V1).
   */
  async getChatDetail(chatId: number | string, type: ChatType = ChatType.PRIVATE): Promise<ServiceResponse<Message[]>> {
    this.requireAuth();
    try {
      const formData = new FormData();
      formData.append('sohbetID', chatId.toString());
      formData.append('sohbetturu', type);

      const response = await this.client.post<any>('/0/0/sohbetdetay/0/0/', formData);
      const data = this.handle<any>(response);
      const mapped = ChatMapper.mapDetailList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama, response?.aciklamadetay);
    } catch (error: any) {
      this.logger.error('[ChatServiceV1] Fetching chat detail failed:', error);
      return this.createError(error.message);
    }
  }

  async editMessage(_messageId: number, _message: string): Promise<ServiceResponse<boolean>> {
    return this.createError('Mesaj düzenleme V1 API tarafından desteklenmiyor.');
  }

  async deleteMessage(_messageId: number): Promise<ServiceResponse<boolean>> {
    return this.createError('Mesaj silme V1 API tarafından desteklenmiyor.');
  }
}
