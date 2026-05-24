import { BaseService } from '../services/BaseService';
import { Conversation, Message, ServiceResponse, ChatType } from '../models';
import { ChatMapper } from '../utils/mappers';
import { ChatMapperV2 } from '../utils/mappersv2/ChatMapperV2';

/**
 * Modern V2 (CURRENT) implementation for ChatService.
 *
 * Endpoints:
 *   GET    /v1/chat?you={userId}&page={page}&limit={limit}  → chat history with a user
 *   POST   /v1/chat/send-message                             → send a message
 *   GET    /v1/chat/friends?page={page}&limit={limit}       → friends list for chat
 *   GET    /v1/chat/inbox?page={page}&limit={limit}         → recent chats / inbox
 *   GET    /v1/chat/detail/{chatId}?type={type}             → messages for a chat room
 *   PUT    /v1/chat/edit-message                            → edit a sent message
 *   DELETE /v1/chat/delete-message                         → delete a sent message
 */
export class ChatServiceV2 extends BaseService {
  /**
   * Fetches the chat history with a specific user (V2).
   * GET /v1/chat?you={userId}&page={page}&limit={limit}
   */
  async getChatHistory(page: number, params: { userId: number, limit?: number }): Promise<ServiceResponse<Message[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ you: params.userId.toString(), page: page.toString() });
      if (params.limit !== undefined) query.set('limit', params.limit.toString());

      const response = await this.client.get<any>(`/v1/chat?${query}`);
      const data = this.handle<any[]>(response);
      const mapped = ChatMapperV2.mapMessageList(data || []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Fetching chat history failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Sends a chat message to a user or group (V2).
   */
  async sendMessage(userId: number, content: string, type: ChatType = ChatType.PRIVATE): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.post<any>('/v1/chat/send-message', {
        recieverId: userId,
        message: content,
        type
      });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Sending message failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of friends available for chat (V2).
   */
  async getFriendsChat(page: number = 1, options?: { limit?: number }): Promise<ServiceResponse<Conversation[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());

      const response = await this.client.get<any>(`/v1/chat/friends?${query}`);
      const data = this.handle<any>(response);
      const mapped = ChatMapper.mapFriendList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Fetching friends chat failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches the list of recent chats / inbox (V2).
   */
  async getChats(page: number = 1, options?: { userId?: number, limit?: number }): Promise<ServiceResponse<Conversation[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ page: page.toString() });
      if (options?.limit) query.set('limit', options.limit.toString());
      if (options?.userId) query.set('user_id', options.userId.toString());

      const response = await this.client.get<any>(`/v1/chat/inbox?${query}`);
      const data = this.handle<any>(response);
      const mapped = ChatMapper.mapInboxList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Fetching chats failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Fetches messages for a specific chat room (V2).
   */
  async getChatDetail(chatId: number, type: ChatType = ChatType.PRIVATE): Promise<ServiceResponse<Message[]>> {
    this.requireAuth();
    try {
      const query = new URLSearchParams({ type });
      const response = await this.client.get<any>(`/v1/chat/detail/${chatId}?${query}`);
      const data = this.handle<any>(response);
      const mapped = ChatMapperV2.mapMessageList(Array.isArray(data) ? data : []);
      return this.createSuccess(mapped, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Fetching chat detail failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Edits a previously sent message (V2).
   * PUT /v1/chat/edit-message
   */
  async editMessage(messageId: number, message: string): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.put<any>('/v1/chat/edit-message', { messageId, message });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Editing message failed:', error.message);
      return this.createError(error.message);
    }
  }

  /**
   * Deletes a sent message (V2).
   * DELETE /v1/chat/delete-message
   */
  async deleteMessage(messageId: number): Promise<ServiceResponse<boolean>> {
    this.requireAuth();
    try {
      const response = await this.client.delete<any>('/v1/chat/delete-message', { messageId });
      this.handle(response);
      return this.createSuccess(true, response?.aciklama);
    } catch (error: any) {
      this.logger.error('[ChatServiceV2] Deleting message failed:', error.message);
      return this.createError(error.message);
    }
  }
}
