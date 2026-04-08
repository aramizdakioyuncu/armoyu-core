import { Post } from '../models/social/Post';
import { Notification } from '../models/social/Notification';
import { BaseService } from './BaseService';
import { socketService } from './SocketService';

export class SocialService extends BaseService {
  /**
   * Fetch the social feed (posts from follows/groups).
   */
  async getFeed(page: number = 1): Promise<Post[]> {
    try {
      const response = await this.client.get<any[]>(`/social/feed`, {
        params: { page }
      });
      return response.map(p => Post.fromJSON(p));
    } catch (error) {
      console.error('[SocialService] Fetching feed failed:', error);
      return [];
    }
  }

  /**
   * Create a new post.
   */
  async createPost(content: string, media?: any[]): Promise<Post | null> {
    try {
      const response = await this.client.post<any>('/social/posts', { content, media });
      const post = Post.fromJSON(response);
      
      // Notify via socket if connected
      socketService.emit('post', post);
      
      return post;
    } catch (error) {
      console.error('[SocialService] Creating post failed:', error);
      return null;
    }
  }

  /**
   * Like or unlike a post.
   */
  async toggleLike(postId: string): Promise<boolean> {
    try {
      const response = await this.client.post<{ liked: boolean }>(`/social/posts/${postId}/like`, {});
      
      // Emit socket event for real-time update
      socketService.emit('post_like', { postId, liked: response.liked });
      
      return response.liked;
    } catch (error) {
      console.error('[SocialService] Toggle like failed:', error);
      return false;
    }
  }

  /**
   * Add a comment to a post.
   */
  async addComment(postId: string, content: string): Promise<any> {
    try {
      const response = await this.client.post<any>(`/social/posts/${postId}/comments`, { content });
      return response;
    } catch (error) {
      console.error('[SocialService] Adding comment failed:', error);
      return null;
    }
  }

  /**
   * Get user notifications.
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await this.client.get<any[]>('/social/notifications');
      return response.map(n => Notification.fromJSON(n));
    } catch (error) {
      console.error('[SocialService] Fetching notifications failed:', error);
      return [];
    }
  }

  /**
   * Mark a notification as read.
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.client.post(`/social/notifications/${notificationId}/read`, {});
    } catch (error) {
      console.error('[SocialService] Marking notification as read failed:', error);
    }
  }
}

