/**
 * Core API Client for the ARMOYU platform.
 * Supports instance-based configuration and standard HTTP methods.
 */
import { ArmoyuLogger } from './Logger';
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
export declare class ApiError extends Error {
    message: string;
    status?: number | undefined;
    statusText?: string | undefined;
    data?: any | undefined;
    constructor(message: string, status?: number | undefined, statusText?: string | undefined, data?: any | undefined);
}
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
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
export interface StandardApiResponse<T = any> {
    durum: number;
    aciklama: string | any;
    aciklamadetay?: number;
    icerik: T;
    zaman: string;
}
export declare class ApiClient {
    private config;
    lastRawResponse: any;
    private logger;
    readonly auth: AuthService;
    readonly users: UserService;
    readonly events: EventService;
    readonly groups: GroupService;
    readonly siteInfo: SiteInformationService;
    readonly management: ManagementService;
    readonly rules: RuleService;
    readonly business: BusinessService;
    readonly projects: ProjectService;
    readonly stories: StoryService;
    readonly polls: PollService;
    readonly blocks: BlockService;
    readonly stations: StationService;
    readonly teams: TeamService;
    readonly staff: StaffService;
    readonly locations: LocationService;
    readonly payments: PaymentService;
    readonly chat: ChatService;
    readonly social: SocialService;
    constructor(config: ApiConfig);
    private request;
    get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
    post<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T>;
    put<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T>;
    patch<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T>;
    delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T>;
    setToken(token: string | null): void;
    setApiKey(key: string | null): void;
    getApiKey(): string | null;
    setBaseUrl(url: string): void;
    getBaseUrl(): string;
}
