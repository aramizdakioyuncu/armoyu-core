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
      const response = await this.client.get<any>(`/0/0/sosyal/liste/${page}/`);
      const icerik = this.handleResponse<any[]>(response);
      return icerik.map(p => Post.fromJSON(p));
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
      const icerik = this.handleResponse<any>(response);
      const post = Post.fromJSON(icerik);
      
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
      const response = await this.client.post<any>(`/social/posts/${postId}/like`, {});
      const icerik = this.handleResponse<{ liked: boolean }>(response);
      
      // Emit socket event for real-time update
      socketService.emit('post_like', { postId, liked: icerik.liked });
      
      return icerik.liked;
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
      return this.handleResponse<any>(response);
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
      const response = await this.client.get<any>('/social/notifications');
      const icerik = this.handleResponse<any[]>(response);
      return icerik.map(n => Notification.fromJSON(n));
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
      const response = await this.client.post<any>(`/social/notifications/${notificationId}/read`, {});
      this.handleResponse(response);
    } catch (error) {
      console.error('[SocialService] Marking notification as read failed:', error);
    }
  }
}

