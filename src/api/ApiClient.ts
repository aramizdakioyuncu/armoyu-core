/**
 * Core API Client for the ARMOYU platform.
 * Supports instance-based configuration and standard HTTP methods.
 */
import { ArmoyuLogger, ConsoleLogger } from './Logger';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { EventService } from '../services/EventService';
import { GroupService } from '../services/GroupService';
import { SiteInformationService } from '../services/SiteInformationService';
import { ManagementService } from '../services/ManagementService';
import { RuleService } from '../services/RuleService';
import { BusinessService } from '../services/BusinessService';
import { ChatService } from '../services/ChatService';
import { SocialService } from '../services/SocialService';
import { ProjectService } from '../services/ProjectService';
import { StoryService } from '../services/StoryService';
import { PollService } from '../services/PollService';
import { BlockService } from '../services/BlockService';
import { StationService } from '../services/StationService';
import { TeamService } from '../services/TeamService';
import { StaffService } from '../services/StaffService';
import { LocationService } from '../services/LocationService';
import { PaymentService } from '../services/PaymentService';

export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public statusText?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  method?: HttpMethod | string;
}

export interface ApiConfig {
  baseUrl: string;
  token?: string | null;
  apiKey?: string | null;
  headers?: Record<string, string>;
  logger?: ArmoyuLogger;
}

/**
 * Standard API Response structure for ARMOYU legacy and bot APIs.
 */
export interface StandardApi<T = any> {
  durum: number;
  aciklama: string | any;
  aciklamadetay?: number;
  icerik: T;
  zaman: string;
}

export class ApiClient {
  private config: ApiConfig;
  public lastRaw: any = null;
  private logger: ArmoyuLogger;
  
  public readonly auth: AuthService;
  public readonly users: UserService;
  public readonly events: EventService;
  public readonly groups: GroupService;
  public readonly siteInfo: SiteInformationService;
  public readonly management: ManagementService;
  public readonly rules: RuleService;
  public readonly business: BusinessService;
  public readonly projects: ProjectService;
  public readonly stories: StoryService;
  public readonly polls: PollService;
  public readonly blocks: BlockService;
  public readonly stations: StationService;
  public readonly teams: TeamService;
  public readonly staff: StaffService;
  public readonly locations: LocationService;
  public readonly payments: PaymentService;
  public readonly chat: ChatService;
  public readonly social: SocialService;

  constructor(config: ApiConfig) {
    this.config = {
      ...config,
      headers: {
        ...config.headers,
      },
    };
    this.logger = config.logger || new ConsoleLogger();

    this.auth = new AuthService(this, this.logger);
    this.users = new UserService(this, this.logger);
    this.events = new EventService(this, this.logger);
    this.groups = new GroupService(this, this.logger);
    this.siteInfo = new SiteInformationService(this, this.logger);
    this.management = new ManagementService(this, this.logger);
    this.rules = new RuleService(this, this.logger);
    this.business = new BusinessService(this, this.logger);
    this.projects = new ProjectService(this, this.logger);
    this.stories = new StoryService(this, this.logger);
    this.polls = new PollService(this, this.logger);
    this.blocks = new BlockService(this, this.logger);
    this.stations = new StationService(this, this.logger);
    this.teams = new TeamService(this, this.logger);
    this.staff = new StaffService(this, this.logger);
    this.locations = new LocationService(this, this.logger);
    this.payments = new PaymentService(this, this.logger);
    this.chat = new ChatService(this, this.logger);
    this.social = new SocialService(this, this.logger);
  }

  private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    // Build URL with query parameters
    let url = `${this.config.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const headers = new Headers(this.config.headers || {});
    
    // Default to JSON body handling if it's a plain object
    let requestBody: any = options.body;
    if (options.body && typeof options.body === 'object' && 
        !(options.body instanceof URLSearchParams) && 
        !(typeof FormData !== 'undefined' && options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      requestBody = JSON.stringify(options.body);
    }
    
    if (this.config.token) {
      // Validate token to avoid 'non ISO-8859-1' errors in headers
      const isAscii = /^[ -~]*$/.test(this.config.token);
      if (isAscii) {
        headers.set('Authorization', `Bearer ${this.config.token}`);
      } else {
        this.logger.warn('[ApiClient] Token contains invalid characters, skipping Authorization header.');
      }
    }
    
    if (this.config.apiKey) {
      // Validate apiKey to avoid 'non ISO-8859-1' errors in headers
      const isAscii = /^[ -~]*$/.test(this.config.apiKey);
      if (isAscii) {
        headers.set('X-API-KEY', this.config.apiKey);
      } else {
        this.logger.warn('[ApiClient] API Key contains invalid characters, skipping X-API-KEY header.');
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: requestBody
      });

      let responseData: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          // Robust JSON parsing for some ARMOYU API endpoints that return JSON but with wrong Content-Type
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
      }

      if (!response.ok) {
        this.lastRaw = responseData;
        const errorMsg = responseData?.aciklama || responseData?.message || `API Error: ${response.status} - ${response.statusText}`;
        throw new ApiError(
          errorMsg,
          response.status,
          response.statusText,
          responseData
        );
      }

      this.lastRaw = responseData;
      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error instanceof Error ? error.message : 'Unknown Network Error');
    }
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: HttpMethod.GET });
  }

  async post<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: HttpMethod.POST, 
      body: body
    });
  }

  async put<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: HttpMethod.PUT, 
      body: body
    });
  }

  async patch<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: HttpMethod.PATCH, 
      body: body
    });
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: HttpMethod.DELETE });
  }

  setToken(token: string | null) {
    this.config.token = token;
  }

  getToken(): string | null {
    return this.config.token || null;
  }

  setApiKey(key: string | null) {
    this.config.apiKey = key;
  }

  getApiKey(): string | null {
    return this.config.apiKey || null;
  }

  setBaseUrl(url: string) {
    this.config.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}




