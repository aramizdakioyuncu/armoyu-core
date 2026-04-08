import { ApiClient, ApiConfig, defaultApiClient } from './ApiClient';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { SocialService } from '../services/SocialService';
import { BlogService } from '../services/BlogService';
import { ShopService } from '../services/ShopService';
import { ForumService } from '../services/ForumService';
import { SupportService } from '../services/SupportService';

/**
 * The main entry point for the ARMOYU platform API.
 * Organizes all services into logical categories.
 */
export class ArmoyuApi {
  public auth: AuthService;
  public users: UserService;
  public social: SocialService;
  public blog: BlogService;
  public shop: ShopService;
  public forum: ForumService;
  public support: SupportService;

  private client: ApiClient;

  constructor(config?: Partial<ApiConfig>) {
    // Use provided config or default client
    if (config && config.baseUrl) {
      this.client = new ApiClient({
        baseUrl: config.baseUrl,
        token: config.token || null,
        headers: config.headers || {},
      });
    } else {
      this.client = defaultApiClient;
    }

    // Initialize services with the api client
    this.auth = new AuthService(this.client);
    this.users = new UserService(this.client);
    this.social = new SocialService(this.client);
    this.blog = new BlogService(this.client);
    this.shop = new ShopService(this.client);
    this.forum = new ForumService(this.client);
    this.support = new SupportService(this.client);
  }

  /**
   * Set a new authentication token for all services.
   */
  setToken(token: string | null) {
    this.client.setToken(token);
  }

  /**
   * Set a new base URL for the API.
   */
  setBaseUrl(url: string) {
    this.client.setBaseUrl(url);
  }
}

// Global singleton instance for easy access
export const armoyu = new ArmoyuApi();
